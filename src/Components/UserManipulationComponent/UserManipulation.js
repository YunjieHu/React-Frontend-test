
import React, {Component} from "react"

class UserManipulation extends Component{
    state = { 
        registration_error:[],
    };

    //auto capitalize the first letter of every name
    caseFix(str){
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        return splitStr.join(' '); 
    }

    handleSubmit = event => {
        event.preventDefault();
        const error=[];
        let success = true;
        let name = event.target.name.value;
        let email = event.target.email.value;
        //handle blank input fields
        if (name === '' || email === ''){
            success = false;
        }
        //handle invalid name
        if (name !== ''){
            if (name.split(" ").length <= 1) {
                success = false;
                error.push({
                    id: 'ADD_USER_ERROR_1',
                    error: 'Must have a first name and a last name'});
            }
        }
        //handle invalid email
        if (email !== ''){
            let emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
            if (!emailValid){
                success = false;
                error.push({
                    id: 'ADD_USER_ERROR_2',
                    error: 'Must have a email format'});
            }
        }

        if (success){
            this.props.addEntry(this.caseFix(name), email);
        }
        else{
            this.setState({
                registration_error: error
            })
        }
        event.target.reset();
    }

    render(){
        return(
            <>
            <h1>Part 2:</h1>
            <form onSubmit={this.handleSubmit}>
            <label>
                Name:
                <input type="text" name="name" required />
            </label>
            <label>
                Email:
                <input type="email" name="email" required />
            </label>
            <button>Add User</button>
            </form>
            {(this.state.registration_error || []).map((error) => (
                    <div key ={error.id} >
                    {error.error}
                    </div>
            ))}
            </>

        );
    }
}

export default UserManipulation;