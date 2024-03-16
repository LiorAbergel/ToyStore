using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ToyStore.Models
{
    [Table("OrderItem")]
    public class OrderItem
    {
        [Key]
        public int OrderItemId { get; set; }

        [Required(ErrorMessage = "Order ID is required.")]
        public int OrderId { get; set; }

        [Required(ErrorMessage = "Toy ID is required.")]
        public int ToyId { get; set; }

        [Required(ErrorMessage = "Amount is required.")]
        [Range(0, 1000, ErrorMessage = "Amount must be between 0 and 1000.")]
        public int Amount { get; set; }

        [Required(ErrorMessage = "Price is required.")]
        [Range(1, 1000, ErrorMessage = "Price must be between $1 and $1000.")]
        public decimal Price { get; set; }

        [ForeignKey("OrderId")]
        public Order Order { get; set; }

        [ForeignKey("ToyId")]
        public Toy Toy { get; set; }
    }
}