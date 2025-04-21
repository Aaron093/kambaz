import { useParams } from "react-router";
import { useState, useEffect } from "react";
import * as coursesClient from "../client";
import * as modulesClient from "./client";
// import * as db from "../../Database";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
// import { v4 as uuidv4 } from "uuid";
import { FormControl } from "react-bootstrap";

import { setModules, addModule, editModule, updateModule, deleteModule }
  from "./reducer";
import { useSelector, useDispatch } from "react-redux";



export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const dispatch = useDispatch();

  const fetchModulesForCourse = async () => {
    const modules = await coursesClient.findModulesForCourse(cid!);
    dispatch(setModules(modules));
  };
  useEffect(() => {
    fetchModulesForCourse();
  }, [cid]);
  
  const removeModule = async (moduleId: string) => {
    await modulesClient.deleteModule(moduleId);
    dispatch(deleteModule(moduleId));
  };
  

  const createModuleForCourse = async () => {
    const newModule = await coursesClient.createModuleForCourse(cid!, {
      name: moduleName,
      course: cid,
    });
    dispatch(addModule(newModule));
    setModuleName("");
  };
  
  const updateModuleHandler = async (module: any) => {
    await modulesClient.updateModule(module);
    dispatch(updateModule(module));
  };
  



  const { currentUser } = useSelector((state: any) => state.accountReducer);
  if (currentUser.role === "FACULTY"){
  return (
  <ul id="wd-modules" className="list-group rounded-0">
  <ModulesControls setModuleName={setModuleName} moduleName={moduleName}
          addModule = {createModuleForCourse}/>
  <br /><br /><br /><br />
  {modules.map((module: any) => (
  <li className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
    <div className="wd-title p-3 ps-2 bg-secondary">
      <BsGripVertical className="me-2 fs-3" />
      {!module.editing && module.name}
      { module.editing && (
      <FormControl className="w-50 d-inline-block" value={module.name}
              onChange={(e) =>
                updateModuleHandler({ ...module, name: e.target.value }) }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateModuleHandler({ ...module, editing: false });
                }
              }}
              defaultValue={module.name}/>
    )}
      <ModuleControlButtons
        moduleId={module._id}
        deleteModule={(moduleId) => removeModule(moduleId)}
        editModule={(moduleId) => {
          dispatch(editModule(moduleId))}} />
    </div>
    {module.lessons && (
      <ul className="wd-lessons list-group rounded-0">
        {module.lessons.map((lesson: any) => (
          <li className="wd-lesson list-group-item p-3 ps-1">
            <BsGripVertical className="me-2 fs-3" /> {lesson.name} <LessonControlButtons />
          </li>
        ))}
      </ul>)}
  </li>))}
</ul>
);}

if (currentUser.role === "STUDENT"){
return (
  <ul id="wd-modules" className="list-group rounded-0">
  <br /><br /><br /><br />
  {modules.map((module: any) => (
  <li className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
    <div className="wd-title p-3 ps-2 bg-secondary">
      <BsGripVertical className="me-2 fs-3" />
      {!module.editing && module.name}
      { module.editing && (
      <FormControl className="w-50 d-inline-block" value={module.name}
              onChange={(e) =>
                updateModuleHandler({ ...module, name: e.target.value }) }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateModuleHandler({ ...module, editing: false });
                }
              }}
              defaultValue={module.name}/>
    )}

    </div>
    {module.lessons && (
      <ul className="wd-lessons list-group rounded-0">
        {module.lessons.map((lesson: any) => (
          <li className="wd-lesson list-group-item p-3 ps-1">
            <BsGripVertical className="me-2 fs-3" /> {lesson.name} <LessonControlButtons />
          </li>
        ))}
      </ul>)}
  </li>))}
</ul>
);}
}

  