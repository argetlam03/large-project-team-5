import CreateUserComponent from '../components/CreateUserComponent.tsx';
import LoginComponent from '../components/LoginComponent.tsx';
import './../styles/login.css';

const LoginPage = () => {
    return (
        <span>
            <h1>TypeFaster</h1> <br />
            <div id="flexbox">
                <LoginComponent />
                <CreateUserComponent />
            </div>
        </span>
    );
};
export default LoginPage;