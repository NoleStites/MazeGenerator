// dotnet run
using Microsoft.AspNetCore.Http.HttpResults;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // <-- your Vite dev server URL
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddControllers();

var app = builder.Build();

// Use CORS
app.UseCors("AllowReactApp");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.MapGet("/initializeMaze", (int width, int height) =>
{
    // Initialize a 2D rectangular array of Node objects
    Node[][] maze = new Node[width][];
    String[][] coords = new String[width][];

    for (int x = 0; x < width; x++)
    {
        maze[x] = new Node[height];
        coords[x] = new String[height];
        for (int y = 0; y < height; y++)
        {
            var newNode = new Node(x, y);
            var newCoord = $"{x},{y}";
            coords[x][y] = newCoord;

            // Connect node to its upper neighbor
            if (y > 0)
            {
                newNode.addNeighbor(maze[x][y - 1]);
                maze[x][y - 1].addNeighbor(newNode);
            }
            // Connect node to its left neighbor
            if (x > 0)
            {
                newNode.addNeighbor(maze[x - 1][y]);
                maze[x - 1][y].addNeighbor(newNode);
            }
            maze[x][y] = newNode;
        }
    }

    // Create path through the maze (start in top-left corner)
    visitNode(maze[0][0]);

    // Print the visited neighbors for debugging
    for (int x = 0; x < width; x++)
    {
        for (int y = 0; y < height; y++)
        {
            Node currentNode = maze[x][y];
            Console.WriteLine($"Node at ({currentNode.coordX}, {currentNode.coordY}) has visited neighbors: {currentNode.visitedNeighbors.Count}");
            foreach (var neighbor in currentNode.visitedNeighbors)
            {
                Console.WriteLine($"  Neighbor at ({neighbor.coordX}, {neighbor.coordY})");
            }
        }
    }

    // Determine where maze borders need to go to fit path
    var borderDirections = determineBorderDirections(maze);

    return Results.Ok(borderDirections);
})
.WithName("GetInitializeMaze");

// Visits the given cell and visits its neighbors recursively
void visitNode(Node node)
{
    node.visited = true;
    while (node.neighbors.Count > 0)
    {
        // Randomly select a neighbor
        int randomIndex = new Random().Next(node.neighbors.Count);
        Node neighbor = node.neighbors[randomIndex];

        // If the neighbor has not been visited, visit it
        if (!neighbor.visited)
        {
            node.visitedNeighbors.Add(neighbor);
            neighbor.visitedNeighbors.Add(node);
            visitNode(neighbor);
        }
        else
        {
            // Remove the neighbor from the current node's neighbors list
            node.removeNeighbor(neighbor);
        }
    }
}

// Return a 2D list such that each element represents a node and the directions that they should render borders (walls) in
// Each element is a list of strings containing 'left', 'right', 'top', 'bottom' if the node has a border in that direction
List<string>[][] determineBorderDirections(Node[][] maze)
{
    List<string>[][] borderDirections = new List<string>[maze.Length][]; // A list at each location containing 'left', ;right', 'top', 'bottom' if the node has a border in that direction
    for (int x = 0; x < maze.Length; x++)
    {
        borderDirections[x] = new List<string>[maze[x].Length];
        for (int y = 0; y < maze[x].Length; y++)
        {
            Node currentNode = maze[x][y];
            // Console.WriteLine($"Processing Node at ({currentNode.coordX}, {currentNode.coordY})");
            // Console.WriteLine($"Neighbors: {currentNode.neighbors.Count}");
            borderDirections[x][y] = new List<string> { "left", "right", "top", "bottom" }; // Initialize with all directions

            // Determine direction of each neighbor node and remove border in that direction
            for (int i = 0; i < currentNode.visitedNeighbors.Count; i++)
            // for (int i = 0; i < currentNode.neighbors.Count; i++)
            {
                Node neighbor = currentNode.visitedNeighbors[i];
                // Node neighbor = currentNode.neighbors[i];
                // Console.WriteLine($"Neighbor at ({neighbor.coordX}, {neighbor.coordY})");
                if (neighbor.coordY < currentNode.coordY) // Neighbor is to the left
                {
                    borderDirections[x][y].Remove("left");
                }
                else if (neighbor.coordY > currentNode.coordY) // Neighbor is to the right
                {
                    borderDirections[x][y].Remove("right");
                }
                else if (neighbor.coordX < currentNode.coordX) // Neighbor is above
                {
                    borderDirections[x][y].Remove("top");
                }
                else if (neighbor.coordX > currentNode.coordX) // Neighbor is below
                {
                    borderDirections[x][y].Remove("bottom");
                }
            }
            // Console.WriteLine($"Border directions for Node at ({currentNode.coordX}, {currentNode.coordY}): {string.Join(", ", borderDirections[x][y])}\n");
        }
    }
    return borderDirections;
}

app.Run();
