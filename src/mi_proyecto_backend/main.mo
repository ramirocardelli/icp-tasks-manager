import Bool "mo:base/Bool";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
actor TaskManager {
  let eq : (Nat, Nat) -> Bool = func(x, y) { x == y };
  public type Task = {
    id : Int;
    title : Text;
    description : Text;
    finished : Bool;
  };

  // Use a Buffer for a resizable array
  let tasks = HashMap.HashMap<Nat, Task>(8, eq, Hash.hash);
  private stable var nextId : Nat = 0;
  public shared func addTask(title : Text, description : Text) : async Task {
    let newTask : Task = {
      id = nextId;
      title = title;
      description = description;
      finished = false;
    };
    tasks.put(nextId, newTask);
    nextId += 1;
    return newTask;
  };

  // Get all tasks
  public query func getAllTasks() : async [Task] {
    return Iter.toArray(tasks.vals());
  };

  // Get all tasks
  public query func getFinishedTasks() : async [Task] {
    let allTasks = Iter.toArray(tasks.vals());
    let mappedIter = Iter.toArray(Iter.filter(Iter.fromArray(allTasks), func(task : Task) : Bool { task.finished }));
    return mappedIter;
  };

  // Get all tasks
  public query func getUnfinishedTasks() : async [Task] {
    let allTasks = Iter.toArray(tasks.vals());
    let mappedIter = Iter.toArray(Iter.filter(Iter.fromArray(allTasks), func(task : Task) : Bool { not task.finished }));
    return mappedIter;
  };

  // Get a specific task by ID
  public query func getTask(id : Nat) : async ?Task {
    return tasks.get(id);
  };

  public shared func deleteTask(id : Nat) : async ?Task {
    return tasks.remove(id);
  };

  public shared func setFinished(id : Nat) : async Bool {
    switch (tasks.get(id)) {
      case (?task) {
        let updatedTask : Task = {
          id = id;
          title = task.title;
          description = task.description;
          finished = true;
        };
        tasks.put(id, updatedTask);
        return true;
      };
      case (null) {
        return false;
      };
    };
  };

};
