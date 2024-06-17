import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import RootLayout from './components/RootLayout';
// import { Suspense, lazy } from 'react';
import Home from './components/body/Home';
import SignUp from './components/body/SignUp';
import SignIn from './components/body/SignIn';
import AuthorProfile from './components/body/SignInComponents/Author/AuthorProfile';
import UserProfile from './components/body/SignInComponents/User/UserProfile';
import Articles from './components/articles/Articles';
import AddArticle from './components/addarticle/AddArticle'
// dynamic import of articles
import Article from './components/article/Article';
import ArticlesByAuthor from './components/articles-by-author/ArticlesByAuthor';
import ErrorPage from './components/ErrorPage';

// const Articles=lazy(()=>import('./components/articles/Articles'))

// const AddArticle=lazy(()=>import('./components/addarticle/AddArticle'));

function App() {

  //browser router obj
  let router = createBrowserRouter([
    {
      path:'',
      element:<RootLayout/>,
      errorElement:<ErrorPage/>,
      children:[
        {
          path:'',
          element:<Home/>
        },
        {
          path:'signup',
          element:<SignUp/>
        },
        {
          path:'signin',
          element:<SignIn/>
        },
        {
          path:'author-profile',
          element:<AuthorProfile/>,
          children:[
            {
              path:'new-article',
              // element:<Suspense fallback='loading...'><AddArticle/></Suspense> 
              element:<AddArticle/>
            },
            {
              path:'articles-by-author/:author',
              element:<ArticlesByAuthor/>
            },
            {
              path:'article/:articleId',
              element:<Article/>
            },
            // {
            //   path:'',
            //   element:<Navigate to='articles-by-author/:author'/>
            // }
          ]
        },
        {
          path:'user-profile',
          element:<UserProfile/>,
          children:[
            {
              path:"articles",
              // element:<Suspense fallback='loading...'><Articles/></Suspense>
              element:<Articles/>
            },
            {
              path:"article/:articleId",
              element:<Article/>
            },
            {
              path:'',
              element:<Navigate to='articles'/>
            }
          ]
        }
      ]
    }
  ])
  return (
    <div className=''>
      {/* providing browser router */}
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
