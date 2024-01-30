"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import classes from "./index.module.scss";

interface Todo {
  id: number;
  text?: string;
  completed: boolean;
}

export default function Home() {
  const [darkTheme, setDarkTheme] = useState<boolean>(
    typeof window !== "undefined" &&
      localStorage.getItem("darkTheme") === "true"
      ? true
      : false
  );
  const [todoList, setTodoList] = useState<Array<Todo>>(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("todoList") || "[]")
      : []
  );
  const [newTask, setNewTask] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");

  const [filterButtons, setFilterButtons] = useState<{
    all: boolean;
    active: boolean;
    completed: boolean;
  }>({
    all: true,
    active: false,
    completed: false,
  });

  const toggleTheme = () => {
    const newTheme = !darkTheme;
    setDarkTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("darkTheme", String(newTheme));
    }
  };

  const addTask = () => {
    if (newTask.trim() === "") return;
    const newTodo: Todo = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };
    setTodoList([...todoList, newTodo]);
    setNewTask("");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("todoList", JSON.stringify(todoList));
    }
  }, [todoList]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const toggleTaskCompletion = (id: number) => {
    const updatedTodoList = todoList.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }
      return todo;
    });
    setTodoList(updatedTodoList);
  };

  const deleteTask = (id: number) => {
    const updatedTodoList = todoList.filter((todo) => todo.id !== id);
    setTodoList(updatedTodoList);
  };

  const handleFilter = (filter: string) => {
    setFilter(filter);

    setFilterButtons({
      all: filter === "all",
      active: filter === "active",
      completed: filter === "completed",
    });
  };

  const filterTasks = (tasks: Todo[]) => {
    switch (filter) {
      case "active":
        return tasks.filter((todo) => !todo.completed);
      case "completed":
        return tasks.filter((todo) => todo.completed);
      default:
        return tasks;
    }
  };

  const remainingTasks = filterTasks(todoList).length;

  const clearList = () => {
    const updatedTodoList = todoList.filter((todo) => !todo.completed);
    setTodoList(updatedTodoList);
  };

  return (
    <div className={`${classes.wrap} ${darkTheme ? classes.darkBack : ""}`}>
      <div
        className={`${classes.wrap_img} ${darkTheme ? classes.darkBack : ""}`}
      ></div>
      <div className={classes.wrap_form}>
        <div className={classes.top_bar}>
          <h1 className={classes.title}>Todo</h1>
          {darkTheme ? (
            <Image
              src="/assets/img/icons/icon-sun.svg"
              height={26}
              width={26}
              alt="Sun"
              onClick={toggleTheme}
              className="cursor-pointer"
            />
          ) : (
            <Image
              src="/assets/img/icons/icon-moon.svg"
              height={26}
              width={26}
              alt="Moon"
              onClick={toggleTheme}
              className="cursor-pointer"
            />
          )}
        </div>
        <div className={classes.wrap_input}>
          <div
            className={`${classes.circle} ${darkTheme ? classes.darkBack : ""}`}
          ></div>
          <input
            type="text"
            className={`${classes.input_task} ${
              darkTheme ? classes.darkBack : ""
            }`}
            placeholder="Create a new to do"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div
          className={`${classes.wrap_list} ${
            darkTheme ? classes.darkBack : ""
          }`}
        >
          {filterTasks(todoList).map((todo) => (
            <div
              className={`${classes.todo} ${
                todo.completed ? classes.completed_line : ""
              }
              ${darkTheme ? classes.darkBack : ""}
              `}
              key={todo.id}
            >
              <div
                className={`${classes.todo_circle} ${
                  todo.completed ? classes.completed : ""
                }
                ${darkTheme ? classes.darkBack : ""}
                `}
                onClick={() => toggleTaskCompletion(todo.id)}
              >
                <Image
                  src="/assets/img/icons/icon-check.svg"
                  height={9}
                  width={11}
                  alt="Check"
                />
              </div>
              {todo.text}
              <Image
                src="/assets/img/icons/icon-cross.svg"
                height={18}
                width={18}
                alt="Cross"
                className={classes.delete_btn}
                onClick={() => deleteTask(todo.id)}
              />
            </div>
          ))}
          <div className={classes.wrap_menu_list}>
            <div className={classes.remaining_tasks}>
              {remainingTasks} items left
            </div>
            <div
              className={`${classes.wrap_filter_btns}
            ${darkTheme ? classes.darkBack : ""}
            `}
            >
              <button
                onClick={() => handleFilter("all")}
                className={`${filterButtons.all ? classes.active : ""}
              ${darkTheme ? classes.darkBack : ""}
              `}
              >
                All
              </button>
              <button
                onClick={() => handleFilter("active")}
                className={`${filterButtons.active ? classes.active : ""}
              ${darkTheme ? classes.darkBack : ""}`}
              >
                Active
              </button>
              <button
                onClick={() => handleFilter("completed")}
                className={`${filterButtons.completed ? classes.active : ""}
              ${darkTheme ? classes.darkBack : ""}`}
              >
                Completed
              </button>
            </div>
            <button
              onClick={clearList}
              className={`${classes.clear_btn}
            ${darkTheme ? classes.darkBack : ""}
            `}
            >
              Clear Completed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
