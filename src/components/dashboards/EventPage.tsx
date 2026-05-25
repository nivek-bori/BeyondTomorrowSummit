import { Course, Event } from "@/prisma/schema.prisma
import Navbar from "./Navbar"
import { useState } from "react";
// { name } : { name: string }
// to specify the type of the object, put ":" after the object ans specify the datatypes of the things in the object

export function CheckInComponent() {
    
    const [isClicked, setIsClicked] = useState(false);

    
    const handleClick = () => {
        setIsClicked(true);
    };

   return (
    // 3. Dynamically change text based on state
        <button onClick={handleClick} color="gray">
            {isClicked ? "Getting Location" : "Check In"}
        </button>
    );
}

export function ExcuseButton() {
    const handleCancelAction = () => {
        window.location.href = '/DashboardComponent'; // Redirect to the dashboard page
    };
    const submitExcuse = () => {
        window.location.href = '/ConfirmationPage'; // Redirect to the confirmation page
    };

    const handleClick = () => {
        alert(
            <div>
                <h1>Request Excuse</h1>
                <p>Please provide a reason for your absence. Your instructor will review your request.</p>
                <form action="/submit-excuse" method="POST">
                    <input
                        type="text"
                        placeholder="enter reason"
                        style={{width: "400px", height: "200px", fontSize: "16px"}}
                    />
                    <br />
                    <button type="submit" onClick={handleCancelAction} name="button" value="submit" color="gray">Cancel</button>
                    <button type="reset" onClick={submitExcuse} name="button" value="submit" color="green">Submit</button>

                </form>
            </div>
        );
    };

    return (
        <button onClick={handleClick}>
            Request Excuse
        </button>
    );
}

export function EventDashboard ({ events }: { events: Event[] }) { 
    return(
        <div>
            <div className="navbar">
                <Navbar />
            </div>

            <div className="event">
                <CheckInComponent></CheckInComponent>
            </div>
            <div className="event">
                <ExcuseButton></ExcuseButton>
            </div>
        </div>
    )
}
