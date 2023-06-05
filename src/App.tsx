import './app.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { MdCreate } from 'react-icons/md';
import Overlay from './components/Overlay/Overlay';

const App = (): JSX.Element => {
  const [todoList, setTodoList] = useState<string[][]>([
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
  ]);
  useEffect(() => {
    const storedTodoList = localStorage.getItem('todoList');
    const parsedTodoList = storedTodoList
      ? JSON.parse(storedTodoList)
      : todoList;

    setTodoList(parsedTodoList);
  }, []);
  type drag = any;
  useEffect(() => {
    localStorage.setItem('todoList', JSON.stringify(todoList));
    const handleDragStart = (e: any) => {
      e.currentTarget.classList.add('dragging');
    };

    const handleDragEnd = (e: any) => {
      e.currentTarget.classList.remove('dragging');
    };

    const handleDragOver = (e: any, container: Element) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      const draggable: drag = document.querySelector('.dragging');

      if (afterElement == null) {
        container.appendChild(draggable);
      } else {
        container.insertBefore(draggable, afterElement);
      }
    };

    const getDragAfterElement = (container: Element, y: number) => {
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
  }, [todoList]);
  const [create, setCreate] = useState(false);
  const [backdrop, setBackdrop] = useState(false);
  const [textareaValue, setTextareaValue] = useState('');
  const addTask = () => {
    if (textareaValue) {
      setTodoList((prev) => {
        const updatedTodoList = [...prev];
        updatedTodoList[2].push(textareaValue);
        return updatedTodoList;
      });
      setCreate(!create);
      setTextareaValue('');
      toast.success('added task successfully');
    } else {
      setCreate(!create);
    }
  };
  const handleUpdate = () => {
    console.log('update');
    setBackdrop(true);
  };
  const handleRemove = (index: number, taskIndex: number) => {
    setTodoList((prev) => {
      const updatedTodoList = [...prev];
      updatedTodoList[index].splice(taskIndex, 1);
      return updatedTodoList;
    });
    toast.error('task deleted successfully');
  };

  return (
    <>
      <ToastContainer autoClose={501} theme='colored' />
      {backdrop && (
        <>
          <Overlay />{' '}
          <div className='fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50'>
            <div className=' flex flex-col items-center justify-center bg-white rounded-lg p-8 shadow-lg'>
              <textarea
                className='w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-black bg-white'
                placeholder='Enter your text here'
              />

              <div className='flex justify-end'>
                <button className='px-4 py-2 mr-2 text-white bg-red-500 rounded-lg hover:bg-red-600'>
                  Cancel
                </button>
                <button className='px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600'>
                  Update
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <div className='w-screen flex flex-col items-center justify-start'>
        <h1 className='mt-8'>ToDo App</h1>
        <div className='max-w-[1200px] mx-auto flex justify-center items-stretch min-h-screen bg-gray-100'>
          {todoList.map((todo, index) => (
            <div
              className={` min-w-[250px] w-3/4 p-4 my-4 rounded-lg shadow-lg ${
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
              {todo.map((task: string, taskIndex: number) => {
                return (
                  <div
                    key={taskIndex}
                    className='flex flex-row-reverse justify-between my-2 border border-gray-500 p-1 cursor-pointer draggable'
                    draggable='true'
                  >
                    <nav className='flex m-1 gap-1 justify-between items-start opacity-0 hover:opacity-100'>
                      <MdCreate
                        onClick={() => handleUpdate(index, taskIndex)}
                        className='text-green-500 w-6'
                      />
                      <AiFillDelete
                        onClick={() => handleRemove(index, taskIndex)}
                        className='text-red-300 w-6'
                      />
                    </nav>
                    <p>{task}</p>
                  </div>
                );
              })}
              {index === 2 ? (
                create ? (
                  <>
                    <textarea
                      value={textareaValue}
                      onChange={(e) => setTextareaValue(e.target.value)}
                      className='resize-none bg-gray-200 text-gray-800 text-lg w-full'
                    ></textarea>
                    <button
                      onClick={() => addTask()}
                      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full border-none outline-none'
                    >
                      Submit
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setCreate(!create)}
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full border-none outline-none'
                  >
                    Create a Task
                  </button>
                )
              ) : undefined}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default App;
