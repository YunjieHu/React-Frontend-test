import React, {Component} from "react"
import userStyles from './user.module.css'
import UserManipulation from '../UserManipulationComponent/UserManipulation'

class User extends Component{
    state = {
        users: [],
        isLoading:true,
        error:null,
        userPerPage: 5,
        currentPage: 1
    };
    
    insert(name, email) {
        const newEntry = {
            name: name,
            email: email
        }
        this.setState({
            users:[...this.state.users, newEntry]
        })
    }
    //shows the next page of users
    nextPage(event) {
        const newCurrent = this.state.currentPage + 1;
        //out of bounds check
        if (this.state.currentPage !== Math.ceil(this.state.users.length/this.state.userPerPage))
        this.setState ({currentPage:newCurrent})
        else
        event.stopPropagation();
    }
    //shows the previous page of users
    prevPage(event){
        const current = this.state.currentPage - 1;
        //out of bounds check
        if (current !== 0)
        this.setState ({currentPage:current})
        else
        event.stopPropagation();
    }

    async componentDidMount(){
        //fetching the users using async await
        const location = "http://jsonplaceholder.typicode.com/users";
        const response = await fetch(location)
        .then(response => response.json())
        .catch(e => {
            this.setState({error: e, isLoading: false})
        });
        this.setState({users: response, isLoading: false, totalUsers: response.length});
    }

    render(){
        const {isLoading, users, error, userPerPage, currentPage} = this.state;
        //sorting the list of users
        const sortedUsers  = [...users].sort((a, b) => a.name > b.name);
        const indexOfLastUser = currentPage * userPerPage;
        //filtering the list of users base on a the page number
        const currentPageUsers = sortedUsers.slice(indexOfLastUser- userPerPage,indexOfLastUser);
        //finding the index of the last page
        const lastPage = Math.ceil(users.length/ userPerPage);
        return(
            <>
            <h1>Part 1:</h1>
            {/* error handling for api get*/}
            {error ? <p>{error.message}</p> : null}
            {/* managing suspense */}
            {!isLoading ? (
                currentPageUsers.map((user, index) => {
                const { name , email} = user;
                //using regex to check if the email ends in .biz
                const biztest = /^[\w\.%\+\-]+@[a-z0-9.-]+\.(biz)$/;
                if (biztest.test(email)){
                    return (
                        <div key={index}>
                        <p className = {userStyles['vip']}>Name: {name}</p>
                        </div>
                    );
                }
                else{
                    return (
                        <div key={index}>
                        <p >Name: {name}</p>
                        </div>
                    );
                }
                })
            ) : (
                <h3>Loading...</h3>
            )}
            {/* hide and show the previous and next page button base on the appropriate logic*/}
            { currentPage !== 1? (<button onClick = {this.prevPage.bind(this)}>Previous </button>):null }
            { currentPage !== lastPage ? (<button onClick = {this.nextPage.bind(this)}> Next </button>):null}
            <br/>
            <UserManipulation addEntry = {this.insert.bind(this)}
            />
            </>
        );
    }
}

export default User;