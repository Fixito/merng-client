import React, { useState, useContext } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';

import { useForm } from '../util/hooks.js';
import { AuthContext } from '../context/auth.js';

function Register(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const registerUser = () => {
    addUser();
  };

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(
      _,
      {
        data: {
          register: { userData }
        }
      }
    ) {
      context.login(userData);
      props.history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values
  });

  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Register</h1>

        <Form.Input
          type='text'
          label='Username'
          placeholder='Username..'
          name='username'
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          type='email'
          label='Email'
          placeholder='Email..'
          name='email'
          value={values.email}
          error={errors.email ? true : false}
          onChange={onChange}
        />
        <Form.Input
          type='password'
          label='Password'
          placeholder='Password..'
          name='password'
          value={values.password}
          onChange={onChange}
          error={errors.password ? true : false}
          autoComplete='on'
        />
        <Form.Input
          type='password'
          label='Confirm Password'
          placeholder='Confirm Password..'
          name='confirmPassword'
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
          autoComplete='on'
        />
        <Button type='submit' primary>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className='ui error message'>
          <ul className='list'>
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
