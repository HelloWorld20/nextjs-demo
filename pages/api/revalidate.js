/**
 * On-Demond ISR 案例
 * 需要在api路由，调用res.revalidate方法即可，需要传入需要revalidate的路由
 */
export default async function handler(req, res) {
  console.log('[Next.js] Revalidating...');
  let revalidated = false;
  try {
    await res.revalidate('/m2/12');
    revalidated = true;
  } catch (err) {
    console.error(err);
  }

  res.json({ revalidated })
}