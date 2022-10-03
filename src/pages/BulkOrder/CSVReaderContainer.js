import React from 'react'
import { toast } from 'react-toastify'
import { axios, SlatwalApiService } from '../../services'
import { useCSVReader } from 'react-papaparse'
import { useTranslation } from 'react-i18next'

const styles = {
  csvReader: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    height: 35,
  },
  browseFile: {
    border: '1px solid #ced4da',
  },
  acceptedFile: {
    border: '1px solid #ced4da',
    lineHeight: 2.5,
    paddingLeft: 10,
    minWidth: 150,
  },
  remove: {
    border: '1px solid #ced4da',
    borderRadius: 0,
    padding: '0 20px',
  },
  progressBarBackgroundColor: {
    backgroundColor: 'red',
  },
}

const CSVReaderContainer = ({ updateItem }) => {
  const { CSVReader } = useCSVReader()
  let source = axios.CancelToken.source()
  const { t } = useTranslation()

  const fetchSkus = (skuCodes, source, params = {}) => {
    return SlatwalApiService.general.getEntity({ 'f:skuCode:in': skuCodes, entityName: 'sku', includeOptions: true, includeSettings: true, ...params }, [], source).then(response => {
      if (response.isSuccess()) {
        if (skuCodes.split(',').length > response.success().data?.pageRecords?.length) {
          let difference = skuCodes.split(',').length - response.success().data?.pageRecords?.length
          if (difference > 1) toast.error(`${difference} ${t('frontend.bulkorder.lineView.invalid_skus_error')}`)
          else toast.error(`${difference} ${t('frontend.bulkorder.lineView.invalid_sku_error')}`)
        }

        if (response.success().data?.pageRecords?.length) {
          return response.success().data?.pageRecords
        } else {
          toast.error(t('frontend.bulkorder.lineView.button.skus_notfound_error'))
          return []
        }
      }
      return response.isSuccess()
    })
  }

  return (
    <CSVReader
      onUploadAccepted={results => {
        let data = results.data
        let skuQtyMapper = [],
          skus = [],
          items = []
        for (let i = 0; i < data.length; i++) {
          if (data[i]?.at(0) !== '') skus[i] = data[i]?.at(0)
          skuQtyMapper[data[i]?.at(0).toUpperCase()] = data[i][1]
        }

        fetchSkus(skus.join(), source).then(skus => {
          for (let i = 0; i < skus.length; i++) {
            let quantity = skuQtyMapper[skus[i].skuCode.toUpperCase()]
            if (quantity) items[i] = { sku: skus[i], quantity: quantity }
          }
          updateItem([...items])
        })
      }}
    >
      {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => (
        <>
          <div style={styles.csvReader}>
            <button type="button" {...getRootProps()} style={styles.browseFile}>
              {t('frontend.bulkorder.lineView.button.browse_file')}
            </button>
            <div style={styles.acceptedFile}>{acceptedFile && acceptedFile.name}</div>
            <button {...getRemoveFileProps()} style={styles.remove}>
              {t('frontend.bulkorder.lineView.button.remove')}
            </button>
          </div>
          <ProgressBar style={styles.progressBarBackgroundColor} />
        </>
      )}
    </CSVReader>
  )
}

export { CSVReaderContainer }
