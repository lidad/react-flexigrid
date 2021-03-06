import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import propTypes from './struct/propTypes'
import { translateDOMPosition } from './utils'
import { shouldUpdateRow } from './FlexiGridUpdateHelper'
import FlexiGridCellGroup from './FlexiGridCellGroup'


export default class FlexiGridRow extends React.Component {
  static PROPTYPES_DISABLED_FOR_PERFORMANCE = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    record: propTypes.record,
    width: PropTypes.number,
    height: PropTypes.number,
    offsetTop: PropTypes.number,
    isHeader: PropTypes.bool,
    rowIndex: PropTypes.number,
    rowHeight: PropTypes.number,
    bordered: PropTypes.bool,
    scrollX: PropTypes.number,
    showScrollbarX: PropTypes.bool,
    showScrollbarY: PropTypes.bool,
    isJustFullfill: PropTypes.bool,
    scrollbarSize: PropTypes.number,

    leftFixedColumns: propTypes.columns,
    scrollableColumns: propTypes.columns,
    rightFixedColumns: propTypes.columns,
    leftFixedLeafColumns: propTypes.columns,
    scrollableLeafColumns: propTypes.columns,
    rightFixedLeafColumns: propTypes.columns,
    scrollableColumnsToRender: propTypes.columns,
    scrollableLeafColumnsToRender: propTypes.columns,
    leftFixedColumnsWidth: PropTypes.number,
    scrollableColumnsWidth: PropTypes.number,
    rightFixedColumnsWidth: PropTypes.number,
    leftFixedColumnsUpdated: PropTypes.bool,
    scrollableColumnsUpdated: PropTypes.bool,
    rightFixedColumnsUpdated: PropTypes.bool,
    scrollableColumnsToRenderUpdated: PropTypes.bool,

    onRowTouchStart: PropTypes.func,
    onRowTouchEnd: PropTypes.func,
    onRowTouchMove: PropTypes.func,

    onRowClick: PropTypes.func,
    onRowDoubleClick: PropTypes.func,
    onRowMouseDown: PropTypes.func,
    onRowMouseUp: PropTypes.func,
    onRowMouseEnter: PropTypes.func,
    onRowMouseLeave: PropTypes.func,
  }

  componentWillMount() {
    this.initialRender = true
  }

  componentDidMount() {
    this.initialRender = false
  }

  shouldComponentUpdate(nextProps) {
    return shouldUpdateRow(this.props, nextProps)
  }

  isJustFullfill() {
    return this.props.width ===
      this.props.leftFixedColumnsWidth +
      this.props.rightFixedColumnsWidth +
      this.props.scrollableColumnsWidth
  }

  shouldFixLastColumnBorder() {
    return this.props.showScrollbarX || this.props.isJustFullfill
  }

  renderLeftFixedColumns() {
    const {
      prefixCls,
      record,
      height,
      rowHeight,
      rowIndex,
      isHeader,
      bordered,
      leftFixedColumns,
      rightFixedColumns,
      scrollableColumns,
      leftFixedLeafColumns,
      leftFixedColumnsWidth,
      leftFixedColumnsUpdated,
    } = this.props

    const props = {
      record,
      prefixCls,
      className: 'fixed-left',
      width: leftFixedColumnsWidth,
      height,
      rowHeight,
      rowIndex,
      isHeader,
      left: 0,
      zIndex: 1,
      columns: leftFixedColumns,
      leafColumns: leftFixedLeafColumns,
      columnsUpdated: leftFixedColumnsUpdated,
    }

    if (scrollableColumns.length === 0 && rightFixedColumns.length === 0) {
      props.fixLastColumnBorder = bordered && this.shouldFixLastColumnBorder()
    }

    return <FlexiGridCellGroup key="left-fixed-columns" {...props} />
  }

  renderScrollableColumns() {
    const {
      prefixCls,
      record,
      height,
      rowHeight,
      rowIndex,
      isHeader,
      bordered,
      scrollX,
      getColumnPosition,
      scrollableColumns,
      rightFixedColumns,
      scrollableLeafColumns,
      scrollableColumnsToRender,
      scrollableLeafColumnsToRender,
      leftFixedColumnsWidth,
      scrollableColumnsWidth,
      scrollableColumnsUpdated,
      scrollableColumnsToRenderUpdated,
    } = this.props

    const props = {
      prefixCls,
      record,
      className: 'scrollable',
      width: scrollableColumnsWidth,
      height,
      rowHeight,
      rowIndex,
      isHeader,
      scrollX,
      left: leftFixedColumnsWidth,
      getColumnPosition,
      columns: scrollableColumns,
      leafColumns: scrollableLeafColumns,
      columnsUpdated: scrollableColumnsUpdated,
      columnsToRender: scrollableColumnsToRender,
      leafColumnsToRender: scrollableLeafColumnsToRender,
      columnsToRenderUpdated: scrollableColumnsToRenderUpdated,
    }

    if (rightFixedColumns.length === 0) {
      props.fixLastColumnBorder = bordered && this.shouldFixLastColumnBorder()
    }

    return <FlexiGridCellGroup key="scrollable-columns" {...props} />
  }

  renderRightFixedColumns() {
    const {
      prefixCls,
      record,
      width,
      height,
      rowHeight,
      rowIndex,
      isHeader,
      bordered,
      showScrollbarX,
      showScrollbarY,
      scrollbarSize,
      rightFixedColumns,
      rightFixedLeafColumns,
      leftFixedColumnsWidth,
      scrollableColumnsWidth,
      rightFixedColumnsWidth,
      rightFixedColumnsUpdated,
    } = this.props

    const props = {
      prefixCls,
      record,
      className: 'fixed-right',
      width: rightFixedColumnsWidth,
      height,
      rowHeight,
      rowIndex,
      isHeader,
      zIndex: 1,
      columns: rightFixedColumns,
      leafColumns: rightFixedLeafColumns,
      columnsUpdated: rightFixedColumnsUpdated,
    }

    if (bordered) {
      props.fixLastColumnBorder = this.shouldFixLastColumnBorder()
    }

    const leftGroupsWidth = leftFixedColumnsWidth + scrollableColumnsWidth
    if (leftGroupsWidth + props.width > width) {
      props.left = width - props.width
    } else {
      props.left = leftGroupsWidth
    }

    if (isHeader && showScrollbarX && showScrollbarY) {
      props.width += scrollbarSize
      props.left -= scrollbarSize
    }

    return <FlexiGridCellGroup key="right-fixed-columns" {...props} />
  }

  render() {
    const { prefixCls, width, height, offsetTop, rowIndex, isHeader } = this.props
    const wrapStyle = { width, height }
    const innerStyle = { width, height }

    translateDOMPosition(wrapStyle, 0, offsetTop, this.initialRender)

    const className = classNames({
      [`${prefixCls}-row`]: true,
      'is-header': isHeader,
      odd: !isHeader && rowIndex % 2 === 1,
      even: !isHeader && rowIndex % 2 === 0,
    })

    return (
      <div className={`${prefixCls}-row-wrap`} style={wrapStyle}>
        <div className={className} style={innerStyle}>
          {
            this.props.leftFixedColumns.length && this.renderLeftFixedColumns()
          }
          {
            this.props.scrollableColumns.length && this.renderScrollableColumns()
          }
          {
            this.props.rightFixedColumns.length && this.renderRightFixedColumns()
          }
        </div>
      </div>
    )
  }
}
