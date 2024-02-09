import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import Button from '../../components/general/Button';
import InputField from '../../components/general/InputField';
import useAuth from '../../hooks/useAuth.hook';
import { PATH_PUBLIC } from '../../routes/paths';
import { IRegisterDto } from '../../types/auth.types';

const RegisterPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { register } = useAuth();

  const registerSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Email is required').email('Input text must be a valid email'),
    password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 character')
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IRegisterDto>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    },
  });

  const onSubmitRegisterForm = async (data: IRegisterDto) => {
    try {
      setLoading(true);
      await register(data.firstName, data.lastName, data.email, data.password);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const err = error as { data: string; status: number };
      const { status, data } = err;
      if (status === 400 || status === 409) {
        toast.error(data);
      } else {
        toast.error('An Error occurred. Please contact admins');
      }
    }
  };

  return (
    <div className='pageTemplate1'>
      {/* <div>Left</div> */}
      <div className='max-sm:hidden flex-1 min-h-[600px] h-4/5 bg-gradient-to-tr from-[#DAC6FB] via-amber-400 to-[#AAC1F6] flex flex-col justify-center items-center rounded-l-2xl'>
        <div className='h-3/5 p-6 rounded-2xl flex flex-col gap-8 justify-center items-start bg-white bg-opacity-20 border border-[#ffffff55] relative'>
          <h1 className='text-6xl font-bold text-[#754eb4]'>Basic Transfer</h1>
          <h1 className='text-3xl font-bold text-[#754eb490]'>A Home for Departments</h1>
          <h4 className='text-3xl font-semibold text-white'>Users Management</h4>
          <h4 className='text-2xl font-semibold text-white'>V 1.0.0</h4>
          <div className='absolute -top-20 right-20 w-48 h-48 bg-gradient-to-br from-[#ef32d9]  to-[#89fffd] rounded-full blur-3xl'></div>
          <div className='absolute -bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-[#cc2b5e] to-[#753a88] rounded-full blur-3xl'></div>
        </div>
      </div>
      {/* <div>Right</div> */}
      <form
        onSubmit={handleSubmit(onSubmitRegisterForm)}
        className='flex-1 min-h-[600px] h-4/5 bg-[#f0ecf7] flex flex-col justify-center items-center rounded-r-2xl'
      >
        <h1 className='text-4xl font-bold mb-2 text-[#754eb4]'>Register</h1>

        <InputField control={control} label='First Name' inputName='firstName' error={errors.firstName?.message} />
        <InputField control={control} label='Last Name' inputName='lastName' error={errors.lastName?.message} />
        <InputField control={control} label='Email' inputName='email' error={errors.email?.message} />
        <InputField
          control={control}
          label='Password'
          inputName='password'
          inputType='password'
          error={errors.password?.message}
        />

        <div className='px-4 mt-2 mb-6 w-9/12 flex gap-2'>
          <h1>Already Have an account?</h1>
          <Link
            to={PATH_PUBLIC.login}
            className='text-[#754eb4] border border-[#754eb4] hover:shadow-[0_0_5px_2px_#754eb44c] px-3 rounded-2xl duration-200'
          >
            Log in
          </Link>
        </div>

        <div className='flex justify-center items-center gap-4 mt-6'>
          <Button variant='secondary' type='button' label='Reset' onClick={() => reset()} />
          <Button variant='primary' type='submit' label='Register' onClick={() => {}} loading={loading} />
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
