Via our E2E tests, we covered all of the key behaviors:

- We covered filtering by a todo's owner, category, status, and phrase in its body.
- We also covered filtering multiple parameters, namely: body + category and body + category + status.
- We covered adding a new todo
- We covered searching through owners, making sure deleting and entering new criteria worked.

We tested these features in the client because they are what the users of the client will do. Since the E2E tests are successful, along with manually testing things, it's almost safe to assume that everything is working the way it should be.
