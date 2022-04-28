import { useState, useContext } from "react"
import FormInput from "../form-input/form-input.component"
import { signInWithGooglePopup, createUserDocumentFromAuth, signInAuthUserWithEmailAndPassword } from '../../utils/firebase/firebase.utils'
import Button from "../button/button.component"
import { UserContext } from '../../contexts/user.context'
import './sign-in-form.styles.scss'


const defaultFormFields = {
  email: '',
  password: '',
}

const SignInForm = () => { 
  const [formFields, setFormFieds] = useState(defaultFormFields)
  const { email, password } = formFields

  const { setCurrentUser } = useContext(UserContext)

  const resetFormFields = () => {
    setFormFieds(defaultFormFields)
  }

  const signInWithGoogle = async () => {  
    const { user } = await signInWithGooglePopup()
    await createUserDocumentFromAuth(user)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try { 
      const { user } = await signInAuthUserWithEmailAndPassword(email, password)

      setCurrentUser(user)

      resetFormFields()
    } catch (error) {
      switch (error.code) {
        case 'auth/wrong-password':
          alert('Incorrect password for email')
          break
        case 'auth/user-not-found':
          alert('no user associated with this email')
          break
        default:
          console.log(error)
      }
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormFieds({...formFields, [name]: value})
  }
  
  return (
    <div className="sign-up-container">
      <h2>Already have an account?</h2>
      <span>Sign in with your email and password</span>
      <form onSubmit={handleSubmit}>

        <FormInput
          label="Email"
          type="email"
          required
          onChange={handleChange}
          name='email'
          value={email}
        />
        
        <FormInput
          label="Password"
          type="password"
          required
          onChange={handleChange}
          name='password'
          value={password}
        />

        <div className="buttons-container">
          <Button type="submit">Sign in</Button>
          <Button type="button" buttonType="google" onClick={signInWithGoogle}>Google sign in</Button>
        </div>
      </form>
    </div>
  )
}

export default SignInForm