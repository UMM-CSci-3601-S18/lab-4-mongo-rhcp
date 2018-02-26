package umm3601.todo;

import com.mongodb.Block;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Projections;
import com.mongodb.client.model.Filters;
import org.bson.Document;
import com.google.gson.Gson;
import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.model.Filters;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import java.util.Arrays;
import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;
import static java.lang.Integer.parseInt;

/**
 * Controller that manstatuss requests for info about todos.
 */
public class TodoController {

    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> todoCollection;

    /**
     * Construct a controller for todos.
     *
     * @param database the database containing todo data
     */
    public TodoController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        todoCollection = database.getCollection("todos");
    }

    /**
     * Helper method that gets a single todo specified by the `id`
     * parameter in the request.
     *
     * @param id the Mongo ID of the desired todo
     * @return the desired todo as a JSON object if the todo with that ID is found,
     * and `null` if no todo with that ID is found
     */
    public String getTodo(String id) {
        FindIterable<Document> jsonTodos
            = todoCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonTodos.iterator();
        if (iterator.hasNext()) {
            Document todo = iterator.next();
            return todo.toJson();
        } else {
            // We didn't find the desired todo
            return null;
        }
    }


    /** Helper method which iterates through the collection, receiving all
     * documents if no query parameter is specified. If the status query parameter
     * is specified, then the collection is filtered so only documents of that
     * specified status are found.
     *
     * @param queryParams
     * @return an array of Todos in a JSON formatted string
     */
    public String getTodos(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

       /* if (queryParams.containsKey("status")) {
            boolean targetStatus = Integer.parseInt(queryParams.get("status")[0]);
            filterDoc = filterDoc.append("status", targetStatus);
        } */

        if (queryParams.containsKey("owner")) {
            String targetContent = (queryParams.get("owner")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("owner", contentRegQuery);
        }

        //FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingTodos = todoCollection.find(filterDoc);

        return JSON.serialize(matchingTodos);
    }



    public String getTodoSummary() {

        float total = todoCollection.count();
       // float count1 = parseInt(Accumulators.sum("count", 1).toString());
       // float percent1 = count1 / total;

        //^^^ need to get item out of bson, then parseInt

        Document summaryDoc = new Document();
        summaryDoc.append("percentToDosComplete",
            todoCollection.aggregate(
                Arrays.asList(
                    Aggregates.match(Filters.eq("status",true)),
                    Aggregates.group("$status",
                       Accumulators.sum("count", 1),
                        Accumulators.avg("percentage", total)
                    )
                )
            )
        );
        summaryDoc.append("categoriesPercentComplete", new Document()
            .append("groceries", "")
            .append("software design", "")
        );
        summaryDoc.append("ownersPercentComplete", new Document()
            .append("Blanch", "")
            .append("Barry", "")
        );


        return JSON.serialize(summaryDoc);
    }


    /**
     * Helper method which appends received todo information to the to-be added document
     *
     * @param category
     * @param status
     * @param owner
     * @param body
     * @return boolean after successfully or unsuccessfully adding a todo
     */
    public String addNewTodo(String category, boolean status, String owner, String body) {

        Document newTodo = new Document();
        newTodo.append("category", category);
        newTodo.append("status", status);
        newTodo.append("owner", owner);
        newTodo.append("body", body);

        try {
            todoCollection.insertOne(newTodo);
            ObjectId id = newTodo.getObjectId("_id");
            System.err.println("Successfully added new todo [_id=" + id + ", category=" + category + ", status=" + status + " owner=" + owner + " body=" + body + ']');
            // return JSON.serialize(newTodo);
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}
