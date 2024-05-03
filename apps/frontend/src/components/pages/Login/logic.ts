import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import {
  postAuthUserMutation,
  PostAuthUserMutation,
  PostAuthUserMutationVariables,
} from './gql';

export const useLogin = () => {
  const { handleSubmit, register } = useForm();
  const [fetchPost] = useMutation<
    PostAuthUserMutation,
    PostAuthUserMutationVariables
  >(postAuthUserMutation, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const submit = useCallback(
    async (data: any) => {
      await fetchPost({ variables: { data } });
    },
    [fetchPost],
  );

  return {
    handleSubmit: handleSubmit(submit),
    register,
  };
};