## Questions

1. :question: What do we do in the `Server` and `UserController` constructors
to set up our connection to the development database?
1. :question: How do we retrieve a user by ID in the `UserController.getUser(String)` method?
1. :question: How do we retrieve all the users with a given age 
in `UserController.getUsers(Map...)`? What's the role of `filterDoc` in that
method?
1. :question: What are these `Document` objects that we use in the `UserController`? 
Why and how are we using them?
1. :question: What does `UserControllerSpec.clearAndPopulateDb` do?
1. :question: What's being tested in `UserControllerSpec.getUsersWhoAre37()`?
How is that being tested?
1. :question: Follow the process for adding a new user. What role do `UserController` and 
`UserRequestHandler` play in the process?

## Your Team's Answers

1. The server constructor creates a new Mongo DB named userDatabase which is the database 
    named "dev" on the Mongo client. The `UserController` constructor takes in a database 
    and takes the collection named" users, locally naming it userCollection
    
1. It creates a document named jsonUsers that is the collection of all the users in userCollection
    whose "_id" field matches the entered id. It does this by iterating  through userCollection 
    until the user with the matching id is found or it has gone through all of the entries.
    
1. We send a document with all the desired filters to the userCollection and it sends back 
    entries with matching fields. `filterDoc` plays a similar role to what the last lab called 
    `filteredUsers`, it holds our filter criteria and appends new ones as we move through getUsers. 
    It is also the document that is used within userCollection to find the desired search results.
    
1. Data sets comprised of a number of "tag" fields and values attached to them. We use them to define 
    individual users and to define search criteria.
    
1. It creates a copy of the DB, clears out all of the copy's entries, and refills it with predefined 
    data for testing.

1. It is testing the userController's ability to ask for and obtain the correct set of filtered users 
    for a given filter document. It is tested by taking the a document of users filtered by age, and 
    puts it into getUsers. It takes that result and makes sure it has the correct number of users in it,
    as well as making sure the given names match with those found.
    
1. `UserRequestHandler` starts the process taking in all the values for the "tag" fields, then sends that data 
to `UserController`, which takes that data and creates a new user document, inserting it into the userCollection.
