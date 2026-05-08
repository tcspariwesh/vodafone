import React from "react";

const TaskItem = ({ task, deleteTask }) => {

    return (<
        div className="task-card" >
        <p > {task.title}, {task.completed?'completed':'incomplete'}< /p>
            
            <button onClick={() => deleteTask(task)} >
                Delete </button> </div>
    );
};


export default React.memo(TaskItem);