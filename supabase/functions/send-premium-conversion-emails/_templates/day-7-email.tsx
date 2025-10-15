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

interface Day7EmailProps {
  userName: string
  checkoutUrl: string
  promoCode: string
}

export const Day7Email = ({
  userName,
  checkoutUrl,
  promoCode,
}: Day7EmailProps) => (
  <Html>
    <Head />
    <Preview>Última chance: 40% OFF no OnePageBook Premium - válido por 7 dias!</Preview>
    <Body style={main}>
      <Container style={container}>
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
        
        <Text style={footer}>
          Sucesso na sua jornada!<br />
          <strong>Equipe OnePageBook</strong>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default Day7Email

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
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

const footer = {
  color: '#666',
  fontSize: '14px',
  textAlign: 'center' as const,
  marginTop: '40px',
  paddingTop: '20px',
  borderTop: '1px solid #eee',
}
