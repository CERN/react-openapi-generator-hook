import { Button } from '@heroui/button'
import { Tab, Tabs } from '@heroui/tabs'
import { placeholderData, responseConfig } from '../../mocks/data'
import { addToast, Code, Divider, HeroUIProvider, Slider, ToastProvider } from '@heroui/react'
import { Spacer } from '@heroui/spacer'
import { ArrowRightCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { codeToHtml } from 'shikiji'
import { CSSProperties, useEffect, useState } from 'react'
import { Card } from '@heroui/card'
import catppuccin from 'shiki/themes/catppuccin-frappe.mjs'
import rose from 'shiki/themes/rose-pine-moon.mjs'
import red from 'shiki/themes/red.mjs'
import { Tooltip } from '@heroui/tooltip'
import { Skeleton } from '@heroui/skeleton'
import { useApi } from '../hook/useApi'
import { DefaultApiFactory } from '../../open-api-configuration/api'
import type { ThemeRegistrationAny } from 'shiki'

export const HeroOnMount = () => {

  const [{ error, loading, data, response }, fetch, abort] = useApi({
    apiFactory: DefaultApiFactory,
    methodName: 'fetchData'
  }, { manual: true })

  const [json, setJson] = useState(<></>)
  const [delayMs, setDelayMs] = useState(1500)
  const [status, setStatus] = useState('200')

  useEffect(() => {
    if (!loading) {
      if (error?.code === 'ERR_CANCELED') {
        addToast({
          title: <div style={{ marginBottom: '5px' }}>Request cancelled</div>,
          description: <><Code color="danger">data</Code> was not updated.</>,
          color: 'danger'
        })
      }
      if (error) {
        if (Number(error.response?.status) === 404) {
          setDataJson(error.response?.data, rose, warning)
        } else {
          setDataJson(error.response?.data, red, errorColor)
        }
      } else if (data) {
        setDataJson(data, catppuccin, success)
      } else {
        setDataJson(placeholderData, 'none', disabled)
      }
    }
  }, [error, loading, data])

  useEffect(() => {
    console.log(error?.status, error?.code, error)
  }, [error?.status, error?.code, error])

  const success = {
    original: '#303446',
    border: '#17c964',
    from: '#303446',
    via: '#34434A',
    to: '#324657'
  }

  const warning = {
    original: '#232136',
    border: 'orange',
    from: '#232136',
    via: '#292645',
    to: '#262152'
  }

  const errorColor = {
    original: '#390000',
    border: 'red',
    from: '#390000',
    via: '#350202',
    to: '#290101'
  }

  const disabled = {
    original: '#000000',
    border: '#dfdfdf',
    from: '#ededed',
    via: '#ececec',
    to: '#ededed'
  }


  const setDataJson = (data: unknown, theme: ThemeRegistrationAny | string, color: typeof success) => {
    codeToHtml(JSON.stringify(data, null, 2), { lang: 'json', theme: theme }).then(
      res => {
        setJson(
          <Card
            className="bg-gradient-to-tr from-[var(--from)] via-[var(--via)] to-[var(--to)] rounded-2xl"
            style={
              {
                '--from': color.from,
                '--via': color.via ?? color.from,
                '--to': color.to,
                border: `2px solid ${color.border}`
              } as CSSProperties
            }
          >
            <div
              dangerouslySetInnerHTML={{ __html: res.replace(color.original, 'transparent') }}
              style={{ fontSize: '13px', padding: '16px' }}
            />
            <Code
              size="sm"
              style={{
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0,
                width: '40px',
                position: 'absolute',
                bottom: 0,
                right: '25px',
                fontSize: '10px',
                height: '18px',
                lineHeight: '18px',
                textAlign: 'center',
                padding: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                opacity: .75,
                color: error ? error.status === 404 ? '#F6C177' : '#CD8D8DFF' : '#A6D189'
              }}>
              {error ? error.status : response?.status}
            </Code>
          </Card>
        )
      }
    )
  }

  const onPress = () => {
    if (!loading) {
      fetch(undefined, { params: { delay: delayMs, status: status } })
    } else {
      abort()
    }
  }

  return (
    <HeroUIProvider>
      <ToastProvider placement="bottom-center" />
      <div className="hero grid place-items-center">
        <small
          style={{
            backgroundColor: 'white',
            padding: '0 5px',
            color: 'rgba(0,0,0,0.3)',
            zIndex: 99999,
            pointerEvents: 'none',
            marginBottom: '-9px'
          }}
        >
          HTTP Response body
        </small>
        <Divider />
        <Spacer y={4} />
        <Skeleton style={{ borderRadius: '1rem' }} isLoaded={!loading}>
          {json}
        </Skeleton>
        <Spacer y={4} />
        <small
          style={{
            backgroundColor: 'white',
            padding: '0 5px',
            color: 'rgba(0,0,0,0.3)',
            zIndex: 99999,
            pointerEvents: 'none',
            marginBottom: '-9px'
          }}
        >
          UI state
        </small>
        <Divider style={{ marginBottom: '18px' }} />
        <div className="hero flex items-center justify-between w-full">
          <span className="inline-flex items-center gap-1">
            <span className="text-sm">loading:</span>
            <Code
              color={loading ? 'success' : 'secondary'}
              style={{ fontSize: '12px', width: '52px', textAlign: 'center' }}>{String(loading)}</Code>
          </span>

          <span className="inline-flex items-center gap-1">
            <span style={{ color: loading ? '#b6b6b6' : 'inherit' }} className="text-sm">data:</span>
            <Skeleton isLoaded={!loading} style={{ borderRadius: '8px' }}>
            {
              data ?
                <Tooltip content={<Code>{JSON.stringify(data, null, 2)}</Code>}>
                  <Code style={{ fontSize: '12px' }} color="primary">{`{...}`}</Code>
                </Tooltip> :
                <Code style={{ fontSize: '12px' }}>undef</Code>
            }
            </Skeleton>
          </span>

          <span className="inline-flex items-center gap-1">
            <span style={{ color: loading ? '#b6b6b6' : 'inherit' }} className="text-sm">error:</span>
            <Skeleton style={{
              borderRadius: '8px', width: '52px',
              height: '28px'
            }} isLoaded={!loading}
            >
              {
                !loading && error && error.status &&
                <Code color={error.status === 404 ? 'warning' : 'danger'}
                      style={{ fontSize: '12px', width: '52px', textAlign: 'center' }}>{error?.status}</Code>
              }
              {
                !loading && error && error.code === 'ERR_CANCELED' &&

                <Code
                  color="danger"
                  style={{ fontSize: '12px', width: '52px', textAlign: 'center' }}>
                  canc
                </Code>
              }
              {
                !loading && !error && <Code style={{ fontSize: '12px' }}>undef</Code>
              }
            </Skeleton>
          </span>
        </div>
        <Spacer y={4} />
        <small
          style={{
            backgroundColor: 'white',
            padding: '0 5px',
            color: 'rgba(0,0,0,0.3)',
            zIndex: 99999,
            pointerEvents: 'none',
            marginBottom: '-9px'
          }}
        >
          Controls
        </small>
        <Divider />
        <Spacer y={4} />
        <div className="flex w-full items-center justify-between">
          <small
            aria-disabled={loading}
            className="text-sm"
            style={loading ? { opacity: 0.5, pointerEvents: 'none' } : {}}
          >
            HTTP Status
          </small>
          <Tabs
            isDisabled={loading}
            color="primary"
            aria-label="Tabs radius"
            radius="full"
            selectedKey={status}
            onSelectionChange={k => setStatus(String(k))}
          >
            {Object.entries(responseConfig).map(([key, value]) => (
              <Tab
                key={key}
                title={value.status}
              />
            ))}
          </Tabs>
        </div>
        <Spacer y={4} />
        <div className="flex w-full items-center justify-between">
          <Slider
            style={{ width: '280px' }}
            classNames={{ filler: 'bg-linear-to-r from-primary-500 to-primary-400' }}
            value={delayMs}
            onChange={(v) => setDelayMs(Number(v ?? 0))}
            label="Request delay"
            maxValue={5000}
            minValue={0}
            step={5}
            isDisabled={loading}
            renderValue={({ children, ...props }) => (
              <output {...props}>
                {(delayMs / 1000).toFixed(2) + ' seconds'}
              </output>
            )}
          />
          <Tooltip content={loading ? 'Cancel request' : 'Send request'}>
            <Button
              onPress={onPress}
              style={{ borderRadius: '30px' }}
              color={loading ? 'danger' : 'primary'}
              isIconOnly
              className="p-2"
              variant="flat"
            >
              {loading ? <XCircleIcon /> : <ArrowRightCircleIcon />}
            </Button>
          </Tooltip>
        </div>
      </div>
    </HeroUIProvider>
  )
}
