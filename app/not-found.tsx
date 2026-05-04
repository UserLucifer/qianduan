import Link from 'next/link';
import FuzzyText from '@/components/marketing/FuzzyText';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--background, #000)',
      color: 'var(--foreground, #fff)',
      fontFamily: 'inherit',
      textAlign: 'center'
    }}>
      <FuzzyText 
        baseIntensity={0.2}
        hoverIntensity={0.5}
        fuzzRange={30}
        fps={60}
        transitionDuration={0}
        letterSpacing={8}
        direction="horizontal"
        enableHover={true}
        clickEffect={true}
        glitchMode={true}
        glitchInterval={1700}
        glitchDuration={300}
        gradient={["#18b3ff", "#ff33cc", "#ffbf00"]}
      >
        404
      </FuzzyText>
      
      <h2 style={{ 
        marginTop: '2rem', 
        fontSize: '1.5rem', 
        fontWeight: 500,
        letterSpacing: '-0.02em',
        color: 'var(--foreground)'
      }}>
        页面未找到 (Page Not Found)
      </h2>
      
      <p style={{
        marginTop: '0.5rem',
        color: 'var(--muted, #888)',
        maxWidth: '400px',
        marginBottom: '2rem'
      }}>
        您访问的页面可能已经被移除、重命名或暂时不可用。
      </p>

      <Link href="/" style={{
        padding: '12px 32px',
        borderRadius: '8px',
        backgroundColor: '#3b82f6',
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 500,
        transition: 'background-color 0.2s',
        display: 'inline-block'
      }}>
        返回首页
      </Link>
    </div>
  );
}
