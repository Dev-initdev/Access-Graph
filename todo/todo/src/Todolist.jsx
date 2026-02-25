import { useState } from 'react'

const Todolist = ({content}) => {
        const [Read, setRead] = useState(true)
    const [Edit, setEdit] = useState("Edit")

    const [currenttask, setcurrenttask] = useState(content)
     const [display, setdisplay] = useState("block")


    const deletefnc=()=>{
        setdisplay("hidden");
    }

    const edittask=()=>{
        if(Edit==="Edit"){
            setRead(false);
            setEdit("Done")
            

        }

        else{
            setRead(true)
            setEdit("Edit")
        }
        
    }
        
  return (
      <li className={`bg-slate-800 rounded-2xl p-3 flex justify-between ${display}`}>
            
            <input type="text" className='bg-slate-800 text-white ' value={currenttask} readOnly={Read} onChange={(e)=>setcurrenttask(e.target.value)} />
            <div className='flex gap-2'>


            <button className={`bg-black rounded-xl text-xl w-20 hover:font-bold cursor-pointer transition-all ${display}`} onClick={edittask}>{Edit}</button>
            <button className={`bg-black rounded-xl text-xl w-20 hover:font-bold cursor-pointer transition-all ${display}`}onClick={deletefnc}>Delete</button>
            </div>
            </li>
  )
}

export default Todolist