// components can only take one paramenter, if you want to give it multiple parameters you have to do it in an object
// {} ← this is an object

// { name } : { name: string }
// to specify the type of the object, put ":" after the object ans specify the datatypes of the things in the object

export default function Home({ type }: { type: string }) {  
  
  const role = type === 'teacher' ? "create" : "join";

  return (
    <div>
        <h1>{role} class</h1>
        
        <button onClick={submitClassID} className='p-4'><X strokeWidth={3} className="w-4 h-4" /></button>
    </div>
  )
}