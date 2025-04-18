import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import BanCheckmark from "./BanCheckmark"
import { Button, Dropdown } from "react-bootstrap";

import ModuleEditor from "./ModuleEditor";


export default function ModulesControls(
  { moduleName, setModuleName, addModule }:
  { moduleName: string;
    setModuleName: (title: string) => void;
    addModule: () => void; }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
   <div id="wd-modules-controls" className="text-nowrap">
     <Button variant="danger" onClick={handleShow} size="lg" className="me-1 float-end" id="wd-add-module-btn">
       <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
       Module
     </Button>
     <Dropdown className="float-end me-2">
       <Dropdown.Toggle variant="secondary" size="lg" id="wd-publish-all-btn">
         <GreenCheckmark /> Publish All
       </Dropdown.Toggle>
       <Dropdown.Menu>
         <Dropdown.Item id="wd-publish-all">
           <GreenCheckmark /> Publish All
         </Dropdown.Item>
         <Dropdown.Item id="wd-publish-all-modules-and-items">
           <GreenCheckmark /> Publish all modules and items
         </Dropdown.Item>
         <Dropdown.Item id="wd-publish-modules-only">
           <GreenCheckmark /> Publish modules only
         </Dropdown.Item>
         {/* Create two more items with IDs wd-unpublish-all-modules-and-items and wd-unpublish-modules-only with
             labels Unpublish all modules and items and Unpublish modules only */}
         <Dropdown.Item id="wd-unpublish-all-modules-and-items">
          <BanCheckmark /> Unpublish all modules and items
         </Dropdown.Item>
         <Dropdown.Item id="wd-unpublish-modules-only">
          <BanCheckmark />  Unpublish modules only
         </Dropdown.Item>        
       </Dropdown.Menu>
     </Dropdown>
     {/* Implement the View Progress and Collapse All buttons with IDs wd-view-progress and wd-collapse-all */}
     <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-collapse-all">
       Collapse All
     </Button>
     <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-view-progress">
       View Prograss
     </Button>
     <ModuleEditor show={show} handleClose={handleClose} dialogTitle="Add Module"
       moduleName={moduleName} setModuleName={setModuleName} addModule={addModule} />
   </div>
);}
