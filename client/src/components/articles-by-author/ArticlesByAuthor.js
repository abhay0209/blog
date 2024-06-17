import axios from 'axios'
import { axiosWithToken } from '../../axiosWithToken'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function ArticlesByAuthor() {

  let [articlesList,setArticlesList]=useState([])
  let navigate=useNavigate()
  let {currentUser}=useSelector(state=>state.userAuthorLoginReducer)
  

  const getArticlesOfCurrentAuthor=async()=>{
    let res=await axiosWithToken.get(`http://localhost:4000/author-api/articles/${currentUser.username}`)
    console.log(currentUser.username)
    setArticlesList(res.data.payload)
  }

  const readArticleByArticleId=(articleObj)=>{
    navigate(`../article/${articleObj.articleId}`,{state:articleObj})
  }

  useEffect(()=>{
    getArticlesOfCurrentAuthor()
  },[])

  return (
    <div>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-5">
        {articlesList.map((article)=>(
          <div className="col" key={article.articleId}>
            <div className="card h-100 m-3">
              <div className="card-body m-3">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">
                  {article.content.substring(0,80)+"...."}
                </p>
                <button className="custom-btn btn-4" onClick={()=>readArticleByArticleId(article)}>
                  <span>Read More</span>
                </button>
              </div>
              <div className="card-footer">
                <small className="text-body-secondary">
                  Last updated on {article.dateOfModification}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ArticlesByAuthor