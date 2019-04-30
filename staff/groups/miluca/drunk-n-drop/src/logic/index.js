import normalize from '../common/normalize'
import validate from '../common/validate'
import userApi from '../data/user-api'
import cocktailApi from '../data/cocktail-api'
import { LogicError } from '../common/errors'


const logic = {

    set __userId__(id) {
        sessionStorage.userId = id
    },

    get __userId__() {
        return normalize.undefinedOrNull(sessionStorage.userId)
    },

    set __userToken__(token) {
        sessionStorage.userToken = token
    },

    get __userToken__() {
        return normalize.undefinedOrNull(sessionStorage.userToken)
    },

    get isUserLoggedIn() {
        return !!(this.__userId__ && this.__userToken__)
    },


    registerUser(name, email, password) {
        validate.arguments([
            { name: 'name', value: name, type: 'string', notEmpty: true },
            { name: 'email', value: email, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true }
        ])

        validate.email(email)

        return userApi.create(email, password, { name })
            .then(response => {
                if (response.status === 'OK') return

                throw new LogicError(response.error)
            })
    },

    logoutUser() {
        sessionStorage.clear()
    },

    retrieveUser() {

        return userApi.retrieve(this.__userId__, this.__userToken__)
            .then(response => {
                if(response.status === 'OK') {
                    const {data: {username: email, name, favorites, creations}} = response
 
                    return {email, name, favorites, creations}
                } else throw new LogicError(response.error)
            })
    },

    loginUser(email, password) {
        validate.arguments([
            {name: 'email', value: email, type: 'string', notEmpty: true},
            {name: 'password', value: password, type: 'string', notEmpty: true}
        ])

        validate.email(email)
    
        return userApi.authenticate(email, password) 
            .then(response => {
            
                if (response.status === 'OK') {
            
                    const { data: { id, token } } = response
                    
                    this.__userId__ = id
                    this.__userToken__ = token
                } else throw new LogicError(response.error)
            })
    },
    
    toggleFavoriteCocktail(id) {
        validate.arguments([
            { name: 'id', value: id, type: 'string' }
        ]) 

        return userApi.retrieve(this.__userId__, this.__userToken__)
            .then(response => {
                const { status, data } = response
                if (status === 'OK') {
                    const { favorites = [] } = data
                    const index = favorites.indexOf(id)
                    if (index < 0) favorites.push(id)
                    else favorites.splice(index, 1)
                    return userApi.update(this.__userId__, this.__userToken__, { favorites })
                        .then(() => { })
                }

                throw new LogicError(response.error)
            })
    },

    searchByCategory(query) {
        validate.arguments([
            {name : 'query ' , value: query , type : 'string'}
        ])

        return cocktailApi.searchByCategory(query)
    },

    retriveFavorites(){

        return userApi.retrieve(this.__userId__,this.__userToken__)
        .then(response => {
            const {status ,data } = response

            if(status === 'OK'){
                const {favorites = [] } = data

                 return filterDetails(favorites)
            }

            throw new LogicError(response.error)
        })

    },

    cocktailbyGlass(query){
        validate.arguments([
            {name: 'query', value: query, type: 'string', notEmpty: true},
           ])

        return cocktailApi.searchByGlass(query)
           .then(response => {
               if (response.length > 0){
                   return
               }
               else throw new LogicError(response.error)
               
           })
    },

    cocktailbyName(query){
        validate.arguments([
            {name: 'query', value: query, type: 'string', notEmpty: true},
           ])
        return cocktailApi.searchCocktail(query)
           .then(response => {
               if (response.length > 0){
                    return filterDetails(response)
               }
               else throw new LogicError(response.error) 
           })
    },

    cocktailDetail(id){
        validate.arguments([
            {name: 'id', value: id, type: 'string', notEmpty: true},
           ])
        return cocktailApi.searchById(id)
           .then(response => {
               if (response.length > 0){
                    return filterDetails(response)
               }
               else throw new LogicError(response.error)
           })
    }
}

function filterDetails(details){

    if(details.length){
        const calls = details.map(fav => {
           return cocktailApi.searchById(fav)
            .then(({drinks}) => {
                drinks.forEach(drink => {
                    Object.keys(drink).forEach(key => {
                        if(drink[key] === null  || drink[key].trim() == '') {
                            delete drink[key]
                        } 
                    })
                })
                return drinkFormater(drinks[0])
            })
            
        })
        console.log(calls)
        return Promise.all(calls)
    }
}

function drinkFormater(drinkdetails){
    let ingredients =[]
    const drinkeys=Object.keys(drinkdetails)
    const ingredientindex = drinkeys.indexOf('strIngredient1')
    const measuresindex = drinkeys.indexOf('strMeasure1')
    for( let i=0;i < drinkeys.length; i++){
        if(i >= ingredientindex && i < measuresindex)ingredients.push({
            ingredientName: drinkdetails[drinkeys[i]],
            measure: drinkdetails[drinkeys[(i-ingredientindex)+measuresindex]],
            image: `https://www.thecocktaildb.com/images/ingredients/${drinkdetails[drinkeys[i]]}.png`
        })
    }
    let a = {
        id: drinkdetails.idDrink,
        name: drinkdetails.strDrink,
        tag: drinkdetails.strTags,
        category: drinkdetails.strCategory, 
        alcohol:  drinkdetails.strAlcoholic, 
        glass: drinkdetails.strGlass,
        instructions:  drinkdetails.strInstructions,  
        image:  drinkdetails.strDrinkThumb, 
        ingredients
    }
    console.log(a)
    return a
}

export default logic