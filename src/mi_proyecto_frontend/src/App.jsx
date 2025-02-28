import { useState } from 'react';
import { mi_proyecto_backend } from 'declarations/mi_proyecto_backend';

function App() {
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [unfinishedTasks, setUnfinishedTasks] = useState([]);

  function createNewTask(event) {
    event.preventDefault();
    const title = event.target.elements.title.value;
    const description = event.target.elements.description.value;
    mi_proyecto_backend.addTask(title, description);
    loadTasks();
  }

  async function loadTasks() {
    const finished_tasks = await mi_proyecto_backend.getFinishedTasks();
    const unfinished_tasks = await mi_proyecto_backend.getUnfinishedTasks();
    setFinishedTasks(finished_tasks);
    setUnfinishedTasks(unfinished_tasks)
  }

  async function finishTask(event, id) {
    event.preventDefault();
    console.log(id);
    await mi_proyecto_backend.setFinished(id);
    loadTasks();
  }

  async function deleteTask(event, id) {
    event.preventDefault();
    console.log(event);
    console.log(id);
    await mi_proyecto_backend.deleteTask(id);
    loadTasks();
  }


  loadTasks();


  return (
    <main>
      <form className='form' action="#" onSubmit={createNewTask}>
        <h1>Create new task</h1>
        <input id="title" alt="Title" type="text" placeholder='Title' />
        <input id="description" alt="Description" type="text" placeholder='Description' />
        <button type="submit">Add task</button>
      </form>
      {unfinishedTasks && (
        <div>
          <h1 className='tasks'>Unfinished tasks</h1>
          {unfinishedTasks.map((task) => (
            <div className='card' key={task.id}>
              <h2>{task.id}</h2>
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <div className='buttons'>
                <button className='finished' onClick={(e) => finishTask(e, task.id)}>Finished</button>
                <button className='delete' onClick={(e) => deleteTask(e, task.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )
      }
      {
        finishedTasks && (
          <div>
            <h1 className='tasks'>Finished tasks</h1>
            {finishedTasks.map((task) => (
              <div className='card' key={task.id}>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <div className='buttons'>
                  <button className='delete' onClick={(e) => deleteTask(e, task.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </main >
  );
}

export default App;
