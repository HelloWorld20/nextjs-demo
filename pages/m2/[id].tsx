
import Cmp from '../../components/cmp/cmp'


export default function App(props) {
  console.log('%c [ props ]-5', 'font-size:13px; background:pink; color:#bf2c9f;', props.data)
  const page = props.data.pages[0];
  const cmps = page.cmps;

  function revalidate() {
    fetch('/api/revalidate');
  }
  return <div>
    <button onClick={() => revalidate()}>Revalidate</button>
    <section>
      {
        cmps.map(cmp => <Cmp key={cmp.id} data={cmp} />)
      }
    </section>
  </div>
}

function sleep() {
  return new Promise(resolve => setTimeout(resolve, 2000));
}

// 构建时获取数据
export async function getStaticProps(context) {

  const key = context.params.id;

  if (!key) return { props: { data: null } }

  let appData = {}

  try {
    // 可改成api获取或者数据库获取
    appData = require(`../../datas/${key}`);
  } catch (error) {
    appData = { data: null }
  }

  return {
    props: {
      data: appData,
      // time: new Date().toISOString()
    },
    revalidate: 10,
  }
}
// 构建时哪些页面需要pre-render
export async function getStaticPaths() {

  const fs = require('fs');
  const path = require('path');


  const res = fs.readFileSync('./pages/m2/build', { encoding: 'utf-8' })
  const ids = res.split('\n');
  const paths = ids.map(id => `/m2/${id}`)
  console.log(paths)

  // const paths = ['/m2/FyscxU88Muv', '/m2/FyscyO15roC']

  return {
    // 决定哪些页面需要被pre-render
    paths,
    fallback: 'blocking',
  }
}

