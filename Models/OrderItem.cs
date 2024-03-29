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

        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; }

        [Required(ErrorMessage = "Toy ID is required.")]
        public int ToyId { get; set; }

        [ForeignKey("ToyId")]
        public virtual Toy Toy { get; set; }

        [Required(ErrorMessage = "Quantity is required.")]
        [Range(1, 1000, ErrorMessage = "Quantity must be between 1 and 1000.")]
        public int Quantity { get; set; }

    }
}