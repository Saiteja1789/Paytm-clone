export function Signup() {
    return (
        <div className="">
            <div className="" style={{"display":"block"}}>
                <label htmlFor="">Sign Up</label>
                <label htmlFor="">Enter your information to create an account</label>
                <label htmlFor="">First Name</label>
                <input type="text" />
                <label htmlFor="">Last Name</label>
                <input type="text" />
                <label htmlFor="" className="">Email</label>
                <input type="text" className="" />
                <label htmlFor="">Password</label>
                <input type="text" />
                <button>Sign UP</button>
            </div>
        </div>
    )
}