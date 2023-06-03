import './app.scss';
import { useEffect } from 'react';
const todoList=[
  [
    'Design the user interface and wireframes for the website.',
    'Set up the development environment',
    'Create the HTML structure of the web pages.',
    'Implement CSS styles to enhance the visual appearance of the website.',
  ],
  [
    'Write JavaScript code to add interactivity and dynamic functionality to the web pages.',
    'Develop the backend functionality using a server-side programming language ',
    'Connect the frontend and backend by establishing communication between the server and client.',
    'Implement user authentication and authorization systems',
  ],
  [
    "Test the website's functionality and fix any bugs or issues.",
    'Optimize the website for performance and responsiveness.',
    'Conduct cross-browser and cross-device testing to ensure compatibility.',
    'Implement search engine optimization (SEO) techniques to improve website visibility',
    'Deploy the website to a hosting server or platform',
  ],
];


const App = (): JSX.Element => {

  useEffect(() => {
    const handleDragStart = (e:any) => {
      e.currentTarget.classList.add('dragging');
    };

    const handleDragEnd = (e:any) => {
      e.currentTarget.classList.remove('dragging');
    };

    const handleDragOver = (e:any, container:Element) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      const draggable = document.querySelector('.dragging');

      if (afterElement == null) {
        container.appendChild(draggable);
      } else {
        container.insertBefore(draggable, afterElement);
      }
    };

    const getDragAfterElement = (container:Element, y:number) => {
      const draggableElements = [
        ...container.querySelectorAll('.draggable:not(.dragging)'),
      ];

      return draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;

          if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
          } else {
            return closest;
          }
        },
        { offset: Number.POSITIVE_INFINITY }
      ).element;
    };

    const draggables = document.querySelectorAll('.draggable');
    const containers = document.querySelectorAll('.container');

    draggables.forEach((draggable) => {
      draggable.addEventListener('dragstart', handleDragStart);
      draggable.addEventListener('dragend', handleDragEnd);
    });

    containers.forEach((container) => {
      container.addEventListener('dragover', (e) =>
        handleDragOver(e, container)
      );
    });

    return () => {
      draggables.forEach((draggable) => {
        draggable.removeEventListener('dragstart', handleDragStart);
        draggable.removeEventListener('dragend', handleDragEnd);
      });

      containers.forEach((container) => {
        container.removeEventListener('dragover', (e) =>
          handleDragOver(e, container)
        );
      });
    };
  }, []);

  return (
    <div className='w-screen flex flex-col items-center justify-start'>
      <h1 className='mt-8'>ToDo App</h1>
      <div className='max-w-[1200px] mx-auto flex justify-center items-stretch min-h-screen bg-gray-100'>
        {todoList.map((todo, index) => (
          <div
            className={`w-3/4 p-4 my-4 rounded-lg shadow-lg ${
              index === 0
                ? 'done container'
                : index === 1
                ? 'inprogress container'
                : 'todo container'
            }`}
            key={index}
          >
            <h1 className='text-2xl font-bold'>
              {index === 0 ? 'Done' : index === 1 ? 'In Progress' : 'To Do'}
            </h1>
            {todo.map((task: string, taskIndex: number) => (
              <p
                key={taskIndex}
                className='my-2 border border-gray-500 p-1 cursor-pointer draggable'
                draggable='true'
              >
                {task}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};


export default App;
