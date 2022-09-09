import Btn from '../button';
import Image from '../image'
import QRCode from '../qrcode';
import Shape from '../shape'

const cmpsByType = {
  'btn': Btn,
  'image': Image,
  'shape': Shape,
  'qrcode': QRCode
}

export default function Cmp({data}) {
  let Imp = cmpsByType[data.type];

  if (!Imp) return null;

  return <Imp data={data} />
}