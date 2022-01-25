import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

// COMPONENTS
import { logout } from '../store/user.actions.js'

// SVGS
import 'rc-menu/assets/index.css'

class _MenuDropDown extends React.Component {
    state = {

    }

    componentDidMount() {
        const user = this.props.user
        console.log(this.props)
        console.log(user)
    }

    onLogout = () => {
        this.props.logout()
        this.setState({ isLoggedIn: false })
      }

    render() {
        const { user } = this.props
        return (
            <div className="dropdown-user-menu">
                <ul className="dropdown-container">
                    {!user && < Link className="clean-link clean-list" to="/login"><li>Log in</li></Link>}
                    {!user && <Link className="clean-link clean-list" to="/login"><li>Sign up</li></Link>}
                    <Link className="clean-link clean-list" to="/login"><li>Host your home</li></Link>
                    <Link className="clean-link clean-list" to="/login"><li>Help</li></Link>
                    {user && <Link className="clean-link clean-list" to="/"><li onClick={this.onLogout}>Log out</li></Link>}
                </ul>
            </div >
        )
    }
}
function mapStateToProps(state) {
    return {
        user: state.userModule.user,
    }
}
const mapDispatchToProps = {
    logout,
}

export const MenuDropDown = connect(
    mapStateToProps,
    mapDispatchToProps
)(_MenuDropDown)
