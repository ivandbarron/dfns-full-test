import { transfer } from "@/actions/custodial/eip7702";

const Eip7702TestForm = () => {
  return (
    <form action={transfer}>
      <button type="submit">Do a EIP 7702 Transfer</button>
    </form>
  );
};

export default Eip7702TestForm;
