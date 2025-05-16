import React from 'react';
import { useForm } from 'react-hook-form';

function Login() {
  const { register, handleSubmit} = useForm();

  const myFunc = (data) => {
    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(myFunc)}>
        <input type="text" placeholder="Username" {...register("userName", { required: true })}/>
        <input type="password" placeholder="Password" {...register("password", { required: true })} />
        <div>
          <label>
            <input type="radio" value="male" {...register("gender")}/>
            Male
          </label>
          <label>
            <input type="radio" value="female" {...register("gender")} />
            Female
          </label>
        </div>
        <button type='submit'>sign up</button>
      </form>
    </>
  );
}

export default Login;
