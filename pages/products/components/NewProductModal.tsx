import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useEffect, useState } from "react";

const schema = yup.object({
  name: yup.string()
    .required('O nome é obrigatório')
});

interface NewProductModalProps {
  isOpen: boolean;
  onClose: (shouldRefresh: boolean) => void;
}

interface NewProductFormData {
  name: string;
}

export function NewProductModal({
  isOpen,
  onClose
}: NewProductModalProps) {
  const { handleSubmit, register, formState: { errors }, reset } = useForm<NewProductFormData>({
    resolver: yupResolver(schema)
  });

  const [isCreating, setIsCreating] = useState(false);
  const [isServerError, setIsServerError] = useState(false);

  async function onSubmit(data: NewProductFormData) {
    setIsCreating(true);

    try {
      await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name
        })
      });

      close(true);
    }
    catch (error) {
      console.log(error);
      setIsServerError(true);
    }
    finally {
      setIsCreating(false);
    }
  }

  function close(shouldRefresh: boolean) {
    reset();
    setIsServerError(false);
    onClose(shouldRefresh);
  }

  return (
    <Modal isOpen={isOpen}>
      <Modal.Header onClose={() => close(false)}>
        Adicionar novo produto
      </Modal.Header>
      <Modal.Content>
        <form className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <p>Nome</p>
            <input
              type='text'
              className='w-full'
              placeholder='Insira o nome do produto'
              {...register('name')}
            />
            {!!errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}
          </div>
        </form>
        {isServerError && <p className='text-red-500 text-sm'>Ocorreu um erro ao enviar os dados ao servidor</p>}
      </Modal.Content>
      <Modal.Buttons>
        <Button
          variant='secondary'
          onClick={() => close(false)}
          disabled={isCreating}
        >
          Cancelar
        </Button>
        <Button
          type='submit'
          variant='success'
          onClick={handleSubmit(onSubmit)}
          disabled={isCreating}
        >
          {isCreating &&
            <span className='flex'>
              <span className='animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75'></span>
              <span className='relative inline-flex h-3 w-3 rounded-full bg-green-400'></span>
            </span>
          }
          Adicionar
        </Button>
      </Modal.Buttons>
    </Modal>
  );
}