class Node
{
    // Fields
    public int coordX;
    public int coordY;
    public bool visited;
    public List<Node> neighbors; // List of neighboring nodes, regardless of path
    public List<Node> visitedNeighbors; // List of neighboring nodes that are connected in the path

    // Constructor
    public Node(int x, int y)
    {
        coordX = x;
        coordY = y;
        visited = false;
        neighbors = new List<Node>();
        visitedNeighbors = new List<Node>();
    }

    // Adds a reference to a neighbor node to this node's neighbors list.
    public void addNeighbor(Node neighbor)
    {
        if (!neighbors.Contains(neighbor))
        {
            neighbors.Add(neighbor);
        }
    }

    // Removes a reference to a neighbor node from this node's neighbors list.
    public void removeNeighbor(Node neighbor)
    {
        if (neighbors.Contains(neighbor))
        {
            neighbors.Remove(neighbor);
        }
    }
}