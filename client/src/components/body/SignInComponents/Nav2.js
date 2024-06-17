import React from 'react'
import { Link } from 'react-router-dom'

function Nav2(props) {
  return (
    <div className=''>
            <div className='bg-secondary'>
                <ul className="nav justify-content-around bg-secondary my-3 ">
                    {/* link to home */}
                    <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to="new-article">Add new article</Link>
                    </li>
                    {/* link to register */}
                    <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to="articles-by-author/:author">View Articles</Link>
                    </li>
                </ul>

            </div>
        </div>
  )
}

export default Nav2