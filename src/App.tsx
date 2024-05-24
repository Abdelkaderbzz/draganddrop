import './app.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
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
  const [create, setCreate] = useState(false);
    const [jsonInput, setJsonInput] = useState('');
    const [jsonData, setJsonData] = useState(null);
  const [backdrop, setBackdrop] = useState(false);
  const [updatedValue, setUpdatedValue] = useState('');
  const [indexes, setIndexes] = useState({ firstIndex: -1, lastIndex: -1 });
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
    const handleInputChange = (e:any) => {
      setJsonInput(e.target.value);
    };

    const handleJsonSubmit = () => {
      try {
        const parsedJson = JSON.parse(jsonInput);
        setJsonData(parsedJson);
        alert('JSON is valid and has been set to the state.');
      } catch (error) {
        alert('Invalid JSON. Please correct it and try again.');
      }
    };
  const handleUpdate = (index: number, taskIndex: number, submit: string) => {
    if (updatedValue.length < 1 && submit === 'submit') {
      toast.info('Invalid task value');
    } else if (submit === 'submit') {
      setTodoList((prev) => {
        const updatedTodoList = [...prev];
        updatedTodoList[indexes.firstIndex].splice(
          indexes.lastIndex,
          1,
          updatedValue
        );
        return updatedTodoList;
      });
      setBackdrop(false);
      toast.success('Task updated successfully');
    } else {
      setBackdrop(true);
      setIndexes({ firstIndex: index, lastIndex: taskIndex });
      setUpdatedValue(todoList[index][taskIndex]);
    }
  };

  const handleRemove = (index: number, taskIndex: number) => {
    setTodoList((prev) => {
      const updatedTodoList = [...prev];
      updatedTodoList[index].splice(taskIndex, 1);
      return updatedTodoList;
    });
    toast.error('task deleted successfully');
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    index: number,
    taskIndex: number
  ) => {
    event.dataTransfer.setData('text/plain', `${index},${taskIndex}`);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const [draggedIndex, draggedTaskIndex] = data.split(',');
    const convertedDraggedIndex = parseInt(draggedIndex, 10);
    const convertedDraggedTaskIndex = parseInt(draggedTaskIndex, 10);
    const updatedTodoList: string[][] = [...todoList];
    const task =
      updatedTodoList[convertedDraggedIndex][convertedDraggedTaskIndex];
    updatedTodoList[convertedDraggedIndex].splice(convertedDraggedTaskIndex, 1);
    updatedTodoList[index].push(task);
    setTodoList(updatedTodoList);
  };
  useEffect(() => {
    localStorage.setItem('todoList', JSON.stringify(todoList));
  }, [todoList]);
  return (
    <>
      <ToastContainer autoClose={501} theme='colored' />
      {backdrop && (
        <>
          <Overlay />
          <div className='fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50'>
            <div className='flex flex-col items-center justify-center bg-white rounded-lg p-8 shadow-lg'>
              <textarea
                value={updatedValue}
                onChange={(e) => setUpdatedValue(e.target.value)}
                className='w-[300px] h-[120px] px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-black bg-white'
                placeholder='Enter your task here'
              />
              <div className='flex justify-end'>
                <button
                  onClick={() => setBackdrop(false)}
                  className='px-4 py-2 mr-2 text-white bg-red-500 rounded-lg hover:bg-red-600'
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdate(-1, -1, 'submit')}
                  className='px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600'
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <div className='w-screen flex flex-col items-center justify-start'>
        <h1 className='mt-8 title'>list-ninja</h1>
        <textarea
          style={{
            width: '500px',
            color: '#000',
            background: '#fff',
            border: '1px solid',
          }}
          rows={10}
          value={jsonInput}
          onChange={handleInputChange}
          placeholder='Enter JSON here...'
        />
        <button
          style={{
            margin: '10px',
            backgroundColor:'#ddd',
            padding: '5px 12px',
            color: '#000',
            background: '#fff',
            border: '1px solid',
          }}
          onClick={handleJsonSubmit}
          
        >
          Submit JSON
        </button>
        <div className='max-w-[1200px] mx-auto flex justify-start items-stretch min-h-screen bg-gray-100'>
          {todoList.map((todo, index) => (
            <div
              className={`flex flex-col items-center  min-w-[290px] w-3/4 p-4 my-4 rounded-lg shadow-lg ${
                index === 0
                  ? 'done container'
                  : index === 1
                  ? 'inprogress container'
                  : 'todo container'
              }`}
              key={index}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, index)}
            >
              <h1 className='text-2xl font-bold'>
                {index === 0 ? 'Done' : index === 1 ? 'In Progress' : 'To Do'}
              </h1>
              {todo.map((task: string, taskIndex: number) => {
                return (
                  <div
                    key={taskIndex}
                    className='draggable'
                    draggable
                    onDragStart={(event) =>
                      handleDragStart(event, index, taskIndex)
                    }
                  >
                    <nav className='flex m-1 gap-1 justify-between items-start opacity-0 hover:opacity-100'>
                      <MdCreate
                        onClick={() => handleUpdate(index, taskIndex, '')}
                        className='text-green-500 w-6'
                      />
                      <AiFillDelete
                        onClick={() => handleRemove(index, taskIndex)}
                        className='text-red-300 w-6'
                      />
                    </nav>
                    <span>{task}</span>
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
