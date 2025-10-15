import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface TestEmailProps {
  userName: string
  checkoutUrl: string
  promoCode: string
}

export const TestEmail = ({
  userName = "Leitor",
  checkoutUrl,
  promoCode,
}: TestEmailProps) => (
  <Html>
    <Head />
    <Preview>🧪 TESTE - Email Premium OnePageBook com 40% OFF</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={testBanner}>
          <Text style={testBannerText}>🧪 EMAIL DE TESTE</Text>
        </Section>
        
        <Heading style={h1}>⏰ OnePageBook</Heading>
        
        <Text style={text}>Olá {userName}!</Text>
        
        <Text style={text}>
          Uma semana se passou e você continua conosco - isso é incrível! 🎉
        </Text>
        
        <Text style={text}>
          Mas percebemos que você ainda está limitado a 10 resumos por mês. Não deixe seus objetivos de leitura esperarem!
        </Text>
        
        <Section style={discountBox}>
          <Heading style={discountTitle}>40% OFF</Heading>
          <Text style={discountSubtitle}>no primeiro mês Premium!</Text>
          <Text style={discountValidity}>⏰ Válido por apenas 7 dias</Text>
        </Section>
        
        <Section style={benefitsSection}>
          <Text style={benefitItem}>🚀 Usuários Premium leem 3x mais livros</Text>
          <Text style={benefitItem}>📚 Acesso ilimitado ao catálogo completo</Text>
          <Text style={benefitItem}>🎯 Conquistas e gamificação exclusivas</Text>
        </Section>
        
        <Text style={urgencyText}>
          Esta é sua última chance de receber este lembrete. O conhecimento não espera!
        </Text>
        
        <Section style={buttonContainer}>
          <Button
            style={button}
            href={`${checkoutUrl}?prefilled_promo_code=${promoCode}`}
          >
            Quero Premium AGORA
          </Button>
        </Section>
        
        <Text style={smallText}>
          Desconto aplicado automaticamente no checkout
        </Text>
        
        <Text style={codeInfo}>
          <strong>Cupom:</strong> {promoCode}<br />
          <strong>Link:</strong> {checkoutUrl}
        </Text>
        
        <Text style={footer}>
          Sucesso na sua jornada!<br />
          <strong>Equipe OnePageBook</strong>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default TestEmail

const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: 'Arial, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
}

const testBanner = {
  backgroundColor: '#fbbf24',
  padding: '10px',
  textAlign: 'center' as const,
  marginBottom: '20px',
}

const testBannerText = {
  color: '#000',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
}

const h1 = {
  color: '#333',
  fontSize: '32px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '20px 0',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const discountBox = {
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  borderRadius: '12px',
  padding: '25px',
  textAlign: 'center' as const,
  margin: '25px 0',
}

const discountTitle = {
  color: '#ffffff',
  fontSize: '48px',
  fontWeight: 'bold',
  margin: '0',
}

const discountSubtitle = {
  color: '#ffffff',
  fontSize: '20px',
  margin: '10px 0',
}

const discountValidity = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '15px 0 0 0',
}

const benefitsSection = {
  margin: '20px 0',
}

const benefitItem = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '32px',
  margin: '0',
}

const urgencyText = {
  color: '#dc2626',
  fontSize: '16px',
  fontWeight: 'bold',
  lineHeight: '24px',
  margin: '20px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
}

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '15px 40px',
  display: 'inline-block',
}

const smallText = {
  color: '#666',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '15px 0',
}

const codeInfo = {
  backgroundColor: '#f9fafb',
  padding: '15px',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#666',
  margin: '20px 0',
  border: '1px solid #e5e7eb',
}

const footer = {
  color: '#666',
  fontSize: '14px',
  textAlign: 'center' as const,
  marginTop: '40px',
  paddingTop: '20px',
  borderTop: '1px solid #eee',
}
