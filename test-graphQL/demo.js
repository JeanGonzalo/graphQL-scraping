//const gql = require('graphql-tag')
const { ApolloServer, gql } = require('apollo-server')
const fs = require('fs')
import scraping from './scraping-linkedin'
console.log('estamos en scraping', scraping)
let scrap = []

/* 
let contents = fs.readFileSync('./scrapingContacts.txt', 'utf8');
console.log('estamos en contents')
console.log(contents);
console.log('terminamos contents') */
const typeDefs = gql`
type User{
    email: String! 
    avatar: String
    friends: [User!]!
}


type Contacts{
    nombre: String  
    urlImage: String
    ocupacion: String
}

type Query{
    me: User!   
    Contact: [Contacts]
}
`

const resolvers = {
    Query: {
        Contact: () => scrap

    }
}

class init {

    constructor() {
        this.loadData()
    }

    async loadData() {
        scrap = await scraping();
        //console.log(`estamos en scrap ${scrap}`)
        const server = await new ApolloServer({
            typeDefs,
            resolvers
        })
        await server.listen(4000, () => {/* 
            const contatcs = await require('./scraping-linkedin')
            console.log(`estamos en escraping Contacts ${console.log(contatcs)}`) */
            console.log('estamos en el puerto 4000')
        })
    }
}

new init() 