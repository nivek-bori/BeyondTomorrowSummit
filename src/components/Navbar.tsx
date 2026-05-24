export default function Navbar() {
  return (
    <div className='w-full flex items-center'>
      <h1>GeoAttendance</h1>


    </div>
  )
}

function RoleSelector({role, setRole}: {role: string, setRole: (role: string) => void}) {
  return (
    <div className='rounded-full border-2 border-black p-2'>
      <button
        onClick={() => setRole('student')}
        className={``}
      >
        Student
      </button>
      
      <button
        onClick={() => setRole('teacher')}
      >
        Teacher
      </button>
    </div>
  )
}