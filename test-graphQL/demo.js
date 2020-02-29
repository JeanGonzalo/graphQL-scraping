//const gql = require('graphql-tag')
const { ApolloServer, gql } = require('apollo-server')
//const fs = require('fs');
const scraping = require('./scraping-linkedin');
//import scraping from './scraping-linkedin'
//console.log('estamos en scraping', scraping)
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

        this.server
        this.loadData()
    }

    async loadData() {
        scrap = await scraping();
        //console.log(`estamos en scrap ${scrap}`)
        this.serv()
        this.start()

    }
    serv() {
        this.server = new ApolloServer({
            typeDefs,
            resolvers
        })
    }

    start() {
        this.server.listen().then(({ url }) => console.log(`VAS A CAER GAAA ${url}`))
    }
}

new init() 