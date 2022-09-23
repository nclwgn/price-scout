import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

const schema = yup.object({
  name: yup.string()
    .required('O nome é obrigatório')
});

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NewProductFormData {
  url: string;
  querySelector: string;
}

export function NewProductModal({
  isOpen,
  onClose
}: NewProductModalProps) {
  const { handleSubmit, register, formState: { errors }, reset } = useForm<NewProductFormData>({
    resolver: yupResolver(schema)
  });

  function onSubmit(data: NewProductFormData) {
    console.log(data);
  }

  function onCloseModal() {
    reset();
    onClose();
  }

  return (
    <Modal isOpen={isOpen}>
      <Modal.Header onClose={onCloseModal}>
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
      </Modal.Content>
      <Modal.Buttons>
        <Button
          variant='secondary'
          onClick={onCloseModal}
        >
          Cancelar
        </Button>
        <Button
          type='submit'
          variant='success'
          onClick={handleSubmit(onSubmit)}
        >
          Adicionar
        </Button>
      </Modal.Buttons>
    </Modal>
  );
}