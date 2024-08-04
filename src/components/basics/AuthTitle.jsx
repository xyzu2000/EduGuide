import logo from '../../assets/images/logo.svg';

const AuthTitle = ({ title }) => {
    return (
        <div className="sm:mx-auto sm:w-full sm:max-w-sm mb-8">
            <img className="mx-auto h-16 w-auto" src={logo} />
            <h2 className="text-center text-3xl font-bold leading-9 tracking-tight">
                {title}
            </h2>
        </div>
    );
};

export default AuthTitle;