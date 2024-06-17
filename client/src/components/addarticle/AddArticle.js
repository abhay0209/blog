import { current } from '@reduxjs/toolkit'
import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function AddArticle() {

  let { register, handleSubmit } = useForm()
  let { currentUser } = useSelector(state => state.userAuthorLoginReducer)
  let [err, setErr] = useState('')
  let navigate = useNavigate()
  let token = localStorage.getItem('token')

  //create axios with token
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  })

  const postNewArticle = async (article) => {
    article.dateOfCreation = new Date()
    article.dateOfModification = new Date()
    article.articleId = Date.now()
    article.username = currentUser.username
    article.comments = []
    article.status = true
    console.log(article)
    //make HTTP post req
    let res = await axiosWithToken.post('http://localhost:4000/author-api/article', article)
    if (res.data.message === 'New article created') {
      navigate(`/author-profile/articles-by-author/${currentUser.username}`)
    } else {
      setErr(res.data.message)

    }
  }


  return (
    <div>
      <div className="container">
        <div className="row justify-content-center mt-3">
          <div className="col-lg-8 col-md-6 col-sm-6">
            <div className="card shadow text-center mb-3" style={{ backgroundColor: '#A9A9A9' }}>
              <h1 className='p-3'>New Article</h1>
              <div className='card-body'>
                <form action="" className='' onSubmit={handleSubmit(postNewArticle)}>
                  <input type="text" {...register('title')} name="title" id="title" className="form-control mb-4" placeholder='Title of article' />
                  <input type="text" {...register('category')} name="category" id="category" className="form-control mb-4" placeholder='category' />
                  <textarea name="content" {...register('content')} id="" cols="30" rows="10" className='form-control mb-4' placeholder='Enter content' />
                  <button type="submit" className='btn btn-success'>Add</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddArticle