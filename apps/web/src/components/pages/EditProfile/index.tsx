import styled from '@emotion/styled';
import Image from 'next/image';
import React from 'react';

import Button from '@/components/common/Button';

import {
  useFetchData,
  useUpdateProfile,
  useUpdateProfileAvatar,
} from './logic';

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export type EditProfileProps = {
  id: string;
};

const EditProfile: React.FC<EditProfileProps> = ({ id }) => {
  const { error, data } = useFetchData(id);
  const { handleSubmit, register } = useUpdateProfile(id);
  const { handleAvatarUpload } = useUpdateProfileAvatar(id);

  if (error || !data) return null;

  return (
    <div>
      <h1>Edit Profile</h1>
      <Image
        width={100}
        height={100}
        src={data?.user.avatar ?? ''}
        alt={data?.user.displayName ?? ''}
      />
      <h2>{data?.user.displayName}</h2>
      <p>{data?.user.bio}</p>
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleAvatarUpload}
      />
      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          defaultValue={data?.user.displayName ?? ''}
          {...register('displayName')}
        />
        <textarea defaultValue={data?.user.bio ?? ''} {...register('bio')} />
        <Button type="submit">Update</Button>
      </Form>
    </div>
  );
};

export default EditProfile;
