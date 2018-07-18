import className from '../assets/style/footer.styl'

export default {
  data () {
    return {
      author: 'Jokcy'
    }
  },
  render () {
    return (
      <div id={className.footer}>
        <span>Writtne by {this.author}</span>
      </div>
    )
  }
}
