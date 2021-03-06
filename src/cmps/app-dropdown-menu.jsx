import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { logout, update } from '../store/user.actions.js'
import { toggleModal } from '../store/page.action.js'

// SVGS
import 'rc-menu/assets/index.css'

class _MenuDropDown extends React.Component {
    onLogout = () => {
        this.props.logout()
        this.setState({ isLoggedIn: false })
    }

    render() {
        const { user } = this.props
        return (
            <div className="dropdown-user-menu">
                <ul className="dropdown-container" onClick={() => { this.props.toggleModal() }}>
                    {!user && < Link className="clean-link clean-list" to="/login"><li>Log in</li></Link>}
                    {!user && <Link className="clean-link clean-list" to="/login"><li>Sign up</li></Link>}
                    {user?.isAdmin && <Link className="explore-link clean-link clean-list" to="/admin"><li>Admin panel</li></Link>}
                    <Link className="explore-link clean-link clean-list" to="/stay"><li>Explore</li></Link>
                    {user && user.isHost && <Link className="clean-link clean-list" to="/host"><li>Host your home</li></Link>}
                    {user && <Link className="orders-link clean-link clean-list" to="/orders"><li>Orders {this.props.unreadOrdersCount && this.props.user ? <div className="order-made">{this.props.unreadOrdersCount}</div> : ''}</li></Link>}
                    {user && <Link className="clean-link clean-list" to="/wish-list"><li>Wishlist</li></Link>}
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
        order: state.orderModule.orders,
        unreadOrdersCount: state.orderModule.unreadOrdersCount
    }
}
const mapDispatchToProps = {
    logout,
    update,
    toggleModal

}

export const MenuDropDown = connect(
    mapStateToProps,
    mapDispatchToProps
)(_MenuDropDown)
